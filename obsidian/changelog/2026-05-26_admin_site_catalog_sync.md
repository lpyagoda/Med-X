---
name: 2026-05-26-admin-site-catalog-sync
description: Три фикса по связке админка↔сайт — сортировка списка, скролл в админке, отображение Supabase-товаров на сайте
metadata:
  type: changelog
---

## Контекст
Пользователь сообщил три проблемы со связкой каталога:
1. Новые товары в админ-списке появляются, но порядок «странный».
2. Перестал работать колёсный скролл в админ-разделе.
3. Добавленные через админку товары не показываются на сайте.

## Что нашёл

### #1 — недетерминированный порядок
`listProducts` ([src/lib/admin/products.ts](../../src/lib/admin/products.ts)) сортировал `ORDER BY position ASC`. При создании товара `position` не задаётся (DB default = 0), поэтому все новые позиции висят с `position=0` и Postgres возвращает их в произвольном порядке.

### #2 — Lenis убивал скролл в админке
`useLenis()` подключался в корне приложения ([src/App.tsx](../../src/App.tsx)). Lenis перехватывает wheel-события на `window`, но админ-лейаут ([src/pages/admin/AdminLayout.tsx](../../src/pages/admin/AdminLayout.tsx)) имеет собственный внутренний скролл-контейнер `<div overflow-y-auto>` внутри `h-screen overflow-hidden` корня — Lenis ничего не скроллит (нечего), а нативный wheel-event на внутренний контейнер уже не доходит.

### #3 — публичный каталог жил на статике
`HomePage`/`CatalogPage`/`CategoryPage` все использовали статические `getProducts()`/`getProductsByCategory()` из `@/lib/api`. Для категорий уже была пара `fetchPublicCategories()` + hydrate, для товаров — только `fetchPublicProductBySlug` (срабатывает только на странице товара). Поэтому новые позиции из админки не попадали ни в Home «популярные», ни в Catalog, ни в Category list.

## Что сделал

- **#1**: добавил вторичный `.order("created_at", { ascending: false })` в `listProducts` — новые товары всплывают сверху своей `position`-группы. То же дублирую в `fetchPublicProducts` для консистентности порядка между админом и сайтом.
- **#2**: убрал `useLenis()` из `App`, перенёс в `PublicLayout` — теперь плавный скролл работает только на публичных маршрутах, в `/admin/*` — нативный.
- **#3**: добавил `fetchPublicProducts()` в [src/lib/public/products.ts](../../src/lib/public/products.ts) (берёт `is_active=true`, сортирует так же как админ, возвращает облегчённый список без характеристик/галереи). Подключил в Home/Catalog/CategoryPage по той же схеме, что уже использовалась для категорий: первый рендер — статика, затем подмена данными из Supabase, при ошибке/пустом ответе — тихий фоллбэк на статику.
- **#3b (follow-up)**: фикс гонки в [src/pages/ProductPage.tsx](../../src/pages/ProductPage.tsx). Старое условие `if (notFound || (!product && !staticProduct))` редиректило на /404 ещё до того, как асинхронный `fetchPublicProductBySlug()` успевал отработать — для новых товаров, которых нет в статике, юзер моментально получал 404. Теперь редирект только по явному `notFound`, до завершения fetch — пустой full-height плейсхолдер.
- **#4 ProductCard letterbox**: в [src/components/catalog/ProductCard.tsx](../../src/components/catalog/ProductCard.tsx) фото вписывалось через `object-contain` в слот с явными `px-8`/`py-8` и фиксированной `h-56 max-w-80` (default) / `h-64 w-80` (minimal). Загружаемые админом изображения оставляли заметные «отступы» внутри карточки. Перешёл на `object-cover` + `absolute inset-0`, убрал внутренние paddings и фиксированные размеры. Слот сохраняет `aspect-[4/3]` (default) или `flex-1` (minimal) — фото заполняет его целиком по высоте и ширине.

## Связано
- [[data-model]]
- [[admin-phase2-plan]]
