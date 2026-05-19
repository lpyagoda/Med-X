import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { LEGAL_REVISION_DATE } from "@/lib/legal";

type LegalLayoutProps = {
  badge?: string;
  children: ReactNode;
  description?: string;
  title: string;
};

export function LegalLayout({ badge, children, description, title }: LegalLayoutProps) {
  return (
    <Section className="pt-24 sm:pt-28">
      <Container>
        <div className="mx-auto max-w-3xl">
          <Link className="text-sm font-semibold text-primary" to="/">
            ← На главную
          </Link>
          {badge ? (
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              {badge}
            </p>
          ) : null}
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-4 text-base leading-7 text-muted">{description}</p>
          ) : null}

          <div className="legal-prose mt-10 space-y-6 rounded-[28px] border border-border/70 bg-white/86 p-6 text-[15px] leading-7 text-foreground shadow-[0_24px_70px_rgba(7,55,99,0.06)] backdrop-blur sm:p-10">
            {children}
            <p className="border-t border-border/70 pt-5 text-xs text-muted">
              Редакция документа от {LEGAL_REVISION_DATE}.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
