import { cn } from "@/lib/utils";

type SectionTitleProps = {
  align?: "left" | "center";
  className?: string;
  description?: string;
  title: string;
};

export function SectionTitle({
  align = "left",
  className,
  description,
  title,
}: SectionTitleProps) {
  return (
    <div
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}
    >
      <h2 className="text-3xl font-semibold leading-[1.08] text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 max-w-2xl text-base text-muted sm:text-lg" style={{ lineHeight: "1.2" }}>
          {description}
        </p>
      ) : null}
    </div>
  );
}
