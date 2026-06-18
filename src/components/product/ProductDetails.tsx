type ProductDetailsProps = {
  description?: string;
  shortDescription: string;
};

export function ProductDetails({ description, shortDescription }: ProductDetailsProps) {
  return (
    <section className="rounded-[30px] border border-border/70 bg-white/82 p-6 shadow-[0_22px_60px_rgba(7,55,99,0.07)] backdrop-blur sm:p-8">
      <h2 className="text-2xl font-semibold text-foreground">Описание</h2>
      <p className="mt-5 whitespace-pre-wrap text-base leading-8 text-muted">
        {description || shortDescription}
      </p>
    </section>
  );
}
