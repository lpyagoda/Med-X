import { useCallback, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  RotateCw,
  Upload,
  XCircle,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminButton } from "@/components/admin/ui/button";
import { toast } from "@/components/admin/ui/toast";
import { listCategories, listSubcategories } from "@/lib/admin/categories";
import {
  buildImportPlan,
  buildTemplateWorkbook,
  IMPORT_COLUMNS,
  listExistingProductsForMatch,
  parseWorkbook,
  runImport,
  type ImportPlan,
  type ImportRunResult,
  type ParseResult,
  type RowMatch,
} from "@/lib/admin/excel-import";

type Step = "upload" | "preview" | "done";

function formatPrice(value: number | null): string {
  if (value == null) return "—";
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function AdminProductsImportPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("upload");
  const [parsed, setParsed] = useState<ParseResult | null>(null);
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [busy, setBusy] = useState(false);
  const [summary, setSummary] = useState<ImportRunResult | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const reset = useCallback(() => {
    setParsed(null);
    setPlan(null);
    setSummary(null);
    setFileName("");
    setStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setBusy(true);
    try {
      const buffer = await file.arrayBuffer();
      const parseResult = parseWorkbook(buffer);
      const [categories, subcategories, existingProducts] = await Promise.all([
        listCategories(),
        listSubcategories(),
        listExistingProductsForMatch(),
      ]);
      const planResult = buildImportPlan(
        parseResult,
        categories,
        subcategories,
        existingProducts,
      );
      setParsed(parseResult);
      setPlan(planResult);
      setStep("preview");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Не удалось разобрать файл";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function confirmImport() {
    if (!plan) return;
    setBusy(true);
    try {
      const result = await runImport(plan);
      setSummary(result);
      setStep("done");
      const totalChanged = result.inserted + result.updated;
      if (totalChanged > 0) {
        toast.success(
          `Создано: ${result.inserted}, обновлено: ${result.updated}` +
            (result.rowErrors.length
              ? `, с ошибками: ${result.rowErrors.length}`
              : ""),
        );
      } else if (result.rowErrors.length > 0) {
        toast.error(`Все строки с ошибками: ${result.rowErrors.length}`);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  function downloadTemplate() {
    const buffer = buildTemplateWorkbook();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "med-x-products-template.xlsx";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <AdminHeader
        title="Импорт Excel"
        description="Массовая загрузка товаров"
        actions={
          <AdminButton variant="outline" asChild>
            <Link to="/admin/products">
              <ArrowLeft className="h-4 w-4" />К списку
            </Link>
          </AdminButton>
        }
      />

      <main className="p-8">
        {step === "upload" && (
          <UploadStep
            busy={busy}
            fileInputRef={fileInputRef}
            onFile={handleFile}
            onDownloadTemplate={downloadTemplate}
          />
        )}

        {step === "preview" && parsed && plan && (
          <PreviewStep
            fileName={fileName}
            parsed={parsed}
            plan={plan}
            busy={busy}
            onReset={reset}
            onConfirm={confirmImport}
          />
        )}

        {step === "done" && summary && (
          <DoneStep summary={summary} onReset={reset} />
        )}
      </main>
    </>
  );
}

type UploadStepProps = {
  busy: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onDownloadTemplate: () => void;
};

function UploadStep({ busy, fileInputRef, onFile, onDownloadTemplate }: UploadStepProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="admin-card flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-admin-bg">
          <FileSpreadsheet className="h-7 w-7 text-admin-muted-fg" />
        </div>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Загрузите файл .xlsx
        </h2>
        <p className="mt-2 max-w-md text-sm text-admin-muted-fg">
          Первая строка — заголовки колонок. Категории и подкатегории, которых ещё
          нет, создадутся автоматически. Если в строке указан артикул и он совпадает
          с существующим товаром — товар обновится.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="sr-only"
          onChange={onFile}
          disabled={busy}
        />
        <AdminButton
          className="mt-6"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
        >
          <Upload className="h-4 w-4" />
          {busy ? "Читаем файл…" : "Выбрать файл"}
        </AdminButton>
      </div>

      <div className="admin-card p-6">
        <h3 className="text-sm font-semibold text-foreground">Шаблон файла</h3>
        <p className="mt-1 text-xs text-admin-muted-fg">
          Скачайте, заполните, загрузите. Колонки совпадают с выгрузкой каталога.
        </p>
        <AdminButton variant="outline" className="mt-4" onClick={onDownloadTemplate}>
          <Download className="h-4 w-4" />
          Скачать шаблон .xlsx
        </AdminButton>

        <h3 className="mt-6 text-sm font-semibold text-foreground">Колонки</h3>
        <ul className="mt-3 grid grid-cols-2 gap-1 text-xs text-admin-muted-fg">
          {IMPORT_COLUMNS.map((column) => (
            <li key={column.key} className="flex items-center gap-1.5">
              <code className="text-foreground">{column.label}</code>
              {column.required && <span className="text-destructive">*</span>}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[11px] text-admin-muted-fg">
          <span className="text-destructive">*</span> — обязательная
        </p>
        <p className="mt-3 text-[11px] leading-5 text-admin-muted-fg">
          Наличие: «В наличии» / «Под заказ». Видимость: «да» / «нет».
          Характеристики: «Питание: 220 В, Мощность: 1.2 кВт».
        </p>
      </div>
    </div>
  );
}

type PreviewStepProps = {
  fileName: string;
  parsed: ParseResult;
  plan: ImportPlan;
  busy: boolean;
  onReset: () => void;
  onConfirm: () => void;
};

function PreviewStep({ fileName, parsed, plan, busy, onReset, onConfirm }: PreviewStepProps) {
  const readyCount = plan.ready.length;
  const problemsCount = plan.problems.length;

  return (
    <div className="space-y-6">
      <div className="admin-card flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{fileName}</p>
          <p className="text-xs text-admin-muted-fg">
            Всего строк: {parsed.rows.length} · Готово к импорту:{" "}
            <span className="font-medium text-emerald-700">{readyCount}</span> · С
            ошибками:{" "}
            <span className="font-medium text-destructive">{problemsCount}</span>
          </p>
          <p className="mt-1 text-xs text-admin-muted-fg">
            Создать новых:{" "}
            <span className="font-medium text-foreground">{plan.summary.insert}</span> ·
            Обновить по артикулу:{" "}
            <span className="font-medium text-foreground">{plan.summary.updateBySku}</span> ·
            Обновить по названию:{" "}
            <span className="font-medium text-foreground">{plan.summary.updateByTitle}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdminButton variant="outline" onClick={onReset} disabled={busy}>
            <RotateCw className="h-4 w-4" />
            Заново
          </AdminButton>
          <AdminButton onClick={onConfirm} disabled={busy || readyCount === 0}>
            {busy ? "Импортируем…" : `Импортировать ${readyCount}`}
          </AdminButton>
        </div>
      </div>

      {(plan.newCategories.length > 0 || plan.newSubcategories.length > 0) && (
        <div className="admin-card border-l-4 border-primary/40 p-4 text-sm text-foreground">
          <p className="font-medium">Будут созданы при импорте:</p>
          {plan.newCategories.length > 0 ? (
            <p className="mt-1 text-admin-muted-fg">
              <span className="font-medium text-foreground">Категории:</span>{" "}
              {plan.newCategories.join(", ")}
            </p>
          ) : null}
          {plan.newSubcategories.length > 0 ? (
            <p className="mt-1 text-admin-muted-fg">
              <span className="font-medium text-foreground">Подкатегории:</span>{" "}
              {plan.newSubcategories
                .map((entry) => `${entry.subcategory} (в «${entry.category}»)`)
                .join(", ")}
            </p>
          ) : null}
        </div>
      )}

      {parsed.unmappedColumns.length > 0 && (
        <div className="admin-card border-l-4 border-amber-400 p-4 text-sm text-foreground">
          <p className="font-medium">Неизвестные колонки (будут проигнорированы):</p>
          <p className="mt-1 text-admin-muted-fg">
            {parsed.unmappedColumns.join(", ")}
          </p>
        </div>
      )}

      {problemsCount > 0 && (
        <section className="admin-card overflow-hidden">
          <header className="border-b border-admin-border p-4">
            <h3 className="text-sm font-semibold text-destructive">
              Ошибки ({problemsCount})
            </h3>
          </header>
          <ul className="divide-y divide-admin-border">
            {plan.problems.slice(0, 50).map((problem) => (
              <li key={problem.rowIndex} className="px-4 py-3 text-sm">
                <p className="text-foreground">
                  <span className="font-medium">Строка {problem.rowIndex}:</span>{" "}
                  <span className="text-destructive">{problem.errors.join("; ")}</span>
                </p>
              </li>
            ))}
            {plan.problems.length > 50 && (
              <li className="px-4 py-3 text-xs text-admin-muted-fg">
                …ещё {plan.problems.length - 50} ошибок
              </li>
            )}
          </ul>
        </section>
      )}

      {readyCount > 0 && (
        <section className="admin-card overflow-hidden">
          <header className="border-b border-admin-border p-4">
            <h3 className="text-sm font-semibold text-foreground">
              Готовы к импорту ({readyCount})
            </h3>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-admin-bg text-xs uppercase tracking-wide text-admin-muted-fg">
                <tr>
                  <th className="px-4 py-2 text-left">№</th>
                  <th className="px-4 py-2 text-left">Статус</th>
                  <th className="px-4 py-2 text-left">Артикул</th>
                  <th className="px-4 py-2 text-left">Название</th>
                  <th className="px-4 py-2 text-left">Категория</th>
                  <th className="px-4 py-2 text-left">Подкатегория</th>
                  <th className="px-4 py-2 text-left">Цена</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border">
                {plan.ready.slice(0, 100).map((entry) => (
                  <tr key={entry.rowIndex} className="hover:bg-admin-bg">
                    <td className="px-4 py-2 text-admin-muted-fg">{entry.rowIndex}</td>
                    <td className="px-4 py-2">
                      <RowStatusBadge match={entry.match} />
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-admin-muted-fg">
                      {entry.sku || "—"}
                    </td>
                    <td className="px-4 py-2">{entry.title}</td>
                    <td className="px-4 py-2 text-admin-muted-fg">
                      {entry.category_title}
                    </td>
                    <td className="px-4 py-2 text-admin-muted-fg">
                      {entry.subcategory_title || "—"}
                    </td>
                    <td className="px-4 py-2">{formatPrice(entry.price)}</td>
                  </tr>
                ))}
                {plan.ready.length > 100 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-2 text-xs text-admin-muted-fg">
                      …ещё {plan.ready.length - 100} строк
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function RowStatusBadge({ match }: { match: RowMatch }) {
  if (match.kind === "new") {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        Новый
      </span>
    );
  }
  if (match.kind === "update-by-sku") {
    return (
      <span
        className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
        title={`Совпал артикул с товаром «${match.existingTitle}»`}
      >
        Обновится (артикул)
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700"
      title={`Совпало название с товаром «${match.existingTitle}»`}
    >
      Обновится (название)
    </span>
  );
}

function DoneStep({
  summary,
  onReset,
}: {
  summary: ImportRunResult;
  onReset: () => void;
}) {
  const totalChanged = summary.inserted + summary.updated;
  const hasErrors = summary.rowErrors.length > 0;
  return (
    <div className="space-y-6">
      <div className="admin-card flex flex-col items-center justify-center p-12 text-center">
        {totalChanged > 0 ? (
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        ) : (
          <XCircle className="h-12 w-12 text-destructive" />
        )}
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          {totalChanged > 0 ? "Импорт завершён" : "Ничего не импортировано"}
        </h2>
        <ul className="mt-3 grid gap-1 text-sm text-admin-muted-fg">
          <li>
            Создано товаров:{" "}
            <span className="font-semibold text-foreground">{summary.inserted}</span>
          </li>
          <li>
            Обновлено товаров:{" "}
            <span className="font-semibold text-foreground">{summary.updated}</span>
          </li>
          {summary.createdCategories > 0 ? (
            <li>
              Создано категорий:{" "}
              <span className="font-semibold text-foreground">
                {summary.createdCategories}
              </span>
            </li>
          ) : null}
          {summary.createdSubcategories > 0 ? (
            <li>
              Создано подкатегорий:{" "}
              <span className="font-semibold text-foreground">
                {summary.createdSubcategories}
              </span>
            </li>
          ) : null}
          {hasErrors ? (
            <li className="text-destructive">
              Строк с ошибками: {summary.rowErrors.length}
            </li>
          ) : null}
        </ul>
        <div className="mt-6 flex gap-2">
          <AdminButton asChild>
            <Link to="/admin/products">В список товаров</Link>
          </AdminButton>
          <AdminButton variant="outline" onClick={onReset}>
            <Upload className="h-4 w-4" />
            Импортировать ещё файл
          </AdminButton>
        </div>
      </div>

      {hasErrors ? (
        <section className="admin-card overflow-hidden">
          <header className="border-b border-admin-border p-4">
            <h3 className="text-sm font-semibold text-destructive">
              Ошибки на отдельных строках ({summary.rowErrors.length})
            </h3>
          </header>
          <ul className="divide-y divide-admin-border">
            {summary.rowErrors.slice(0, 100).map((problem, index) => (
              <li key={`${problem.rowIndex}-${index}`} className="px-4 py-3 text-sm">
                <p className="text-foreground">
                  <span className="font-medium">Строка {problem.rowIndex}:</span>{" "}
                  <span className="text-destructive">{problem.error}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
