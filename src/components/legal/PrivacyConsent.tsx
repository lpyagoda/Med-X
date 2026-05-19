import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

type PrivacyConsentProps = {
  checked: boolean;
  className?: string;
  error?: string;
  id?: string;
  onChange: (next: boolean) => void;
};

/**
 * Чекбокс «Согласие на обработку перс. данных». Без него submit на любой
 * клиентской форме сайта запрещён (UI-уровень — отключаем кнопку отправки).
 */
export function PrivacyConsent({
  checked,
  className,
  error,
  id = "privacy-consent",
  onChange,
}: PrivacyConsentProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label className="flex items-start gap-2.5 text-xs leading-5 text-muted" htmlFor={id}>
        <input
          checked={checked}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-border accent-primary"
          id={id}
          onChange={(event) => onChange(event.target.checked)}
          type="checkbox"
        />
        <span>
          Я согласен(а) на обработку моих персональных данных в соответствии с{" "}
          <Link
            className="text-primary underline-offset-2 hover:underline"
            to="/personal-data"
            target="_blank"
          >
            согласием
          </Link>{" "}
          и принимаю{" "}
          <Link
            className="text-primary underline-offset-2 hover:underline"
            to="/privacy"
            target="_blank"
          >
            политику конфиденциальности
          </Link>
          .
        </span>
      </label>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
