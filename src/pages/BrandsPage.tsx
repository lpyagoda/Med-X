import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { fetchPublicBrands } from "@/lib/public/brands";
import type { Brand } from "@/types/brand";

export function BrandsPage({ initialBrands }: { initialBrands?: Brand[] } = {}) {
  const [brands, setBrands] = useState<Brand[]>(() => initialBrands ?? []);
  const [loaded, setLoaded] = useState(() => (initialBrands?.length ?? 0) > 0);

  useEffect(() => {
    let cancelled = false;
    fetchPublicBrands()
      .then((rows) => {
        if (cancelled) return;
        setBrands(rows);
      })
      .catch(() => {
        // Silent — show empty state below.
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <Section className="pt-28 sm:pt-32 lg:pt-36">
      <Container>
        <SectionTitle
          title="Бренды"
          description="Производители стоматологического оборудования, расходных материалов и комплектующих, которые мы поставляем. Выберите бренд, чтобы увидеть его товары в каталоге."
        />

        {loaded && brands.length === 0 ? (
          <div className="mt-10 rounded-[28px] border border-dashed border-border bg-white/72 p-10 text-center shadow-[0_18px_48px_rgba(7,55,99,0.04)]">
            <p className="text-xl font-semibold text-foreground">Бренды скоро появятся</p>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">
              Мы наполняем каталог. Загляните в{" "}
              <Link to="/catalog" className="font-semibold text-primary hover:underline">
                каталог оборудования
              </Link>{" "}
              или оставьте заявку на подбор.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                to={`/catalog?brand=${encodeURIComponent(brand.slug)}`}
                className="group flex flex-col rounded-[24px] border border-border/80 bg-white/82 p-5 shadow-[0_18px_48px_rgba(7,55,99,0.05)] backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_22px_56px_rgba(7,55,99,0.12)]"
              >
                <div className="flex h-20 items-center justify-center">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-16 max-w-[80%] object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-2xl font-bold tracking-tight text-foreground/80">
                      {brand.name}
                    </span>
                  )}
                </div>
                <div className="mt-4 border-t border-border/60 pt-3">
                  <p className="font-semibold text-foreground transition-colors group-hover:text-primary">
                    {brand.name}
                  </p>
                  {brand.manufacturer ? (
                    <p className="mt-0.5 truncate text-xs text-muted">{brand.manufacturer}</p>
                  ) : null}
                  <p className="mt-2 text-xs font-medium text-primary">
                    {brand.productCount} товаров
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
