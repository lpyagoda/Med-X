import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export function NotFoundPage() {
  return (
    <Section className="py-24">
      <Container>
        <div className="mx-auto max-w-xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            404
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            Страница не найдена
          </h1>
          <p className="mt-5 text-base leading-7 text-muted">
            Возможно, ссылка устарела или такого раздела ещё нет. Перейдите в
            каталог или вернитесь на главную.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 text-base font-semibold text-white shadow-[0_18px_38px_rgba(7,55,99,0.18)] transition-all hover:-translate-y-0.5 hover:bg-primary-hover"
              to="/"
            >
              На главную
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-white/72 px-7 text-base font-semibold text-primary backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40"
              to="/catalog"
            >
              В каталог
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}
