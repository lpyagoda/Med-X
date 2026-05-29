---
name: 2026-05-29-brands-admin-catalog
description: Бренды как сущность (таблица + FK), админка брендов, фильтр и страница брендов, расширение админки товаров, тёмный hero, фикс загрузки фото
metadata:
  type: changelog
---

## Контекст
Пользователь поставил 6 задач: (1) расширить админку товаров, (2) бренды как
сущность (бренд → производитель → логотип) с привязкой к товару, (3) фильтр по
бренду в каталоге, (4) публичная страница «Бренды» + пункт меню, (5) тёмный
главный текст hero, (6) фикс «иногда» падающей загрузки фото. Плюс по ходу —
подтянуть бренд (лого + производитель) на странице товара из новой таблицы.

## База
БД — self-hosted Supabase на сервере `188.225.86.146` (delau.pro), контейнер
`supabase_db_med-x` (host-порт 54322), проект `/var/www/med-x`. Доступ по SSH
(root). Миграция применена напрямую через `docker exec ... psql` (stdin), без
копирования файлов на сервер.

## Что сделал

### Задача 2 — бренды (ядро)
- Миграция [supabase/migrations/20260529120000_brands.sql](../../supabase/migrations/20260529120000_brands.sql):
  таблица `brands` (`slug, name, manufacturer, logo_url, description, position,
  is_active`), nullable FK `products.brand_id` (ON DELETE SET NULL), RLS как у
  categories (публичный select активных, full для authenticated). Сид: создал
  14 брендов из distinct `products.brand`, проставил `manufacturer` из товаров,
  привязал 19 товаров по имени.
- Денормализованные `products.brand` / `products.manufacturer` СОХРАНЕНЫ и
  синхронизируются из выбранного бренда — публичный слой и поиск работают без
  изменений.
- Админка: [src/lib/admin/brands.ts](../../src/lib/admin/brands.ts) (CRUD +
  countProductsByBrand), [src/pages/admin/AdminBrandsPage.tsx](../../src/pages/admin/AdminBrandsPage.tsx)
  (плоский список, hover-загрузка логотипа, диалог create/edit), пункт «Бренды»
  в [AdminSidebar](../../src/components/admin/AdminSidebar.tsx), роут
  `/admin/brands`.
- Форма товара [AdminProductFormPage](../../src/pages/admin/AdminProductFormPage.tsx):
  поле «Бренд» теперь `<select>` по `brand_id` + inline-создание (имя +
  производитель). При выборе бренда `manufacturer` подставляется автоматически.
  На сохранении `brand`/`manufacturer` текст синхронизируются из бренда.

### Задача 1 — админка товаров
[AdminProductsListPage](../../src/pages/admin/AdminProductsListPage.tsx) +
[src/lib/admin/products.ts](../../src/lib/admin/products.ts): фильтры (бренд,
наличие, статус) рядом с существующим фильтром категории; сортировка по клику на
колонки (название/бренд/цена) через серверный `order`; чекбоксы строк + панель
массовых действий (показать/скрыть/удалить); дублирование товара
(`duplicateProduct` — копия с фото и характеристиками, создаётся скрытой).

### Задача 3 — фильтр по бренду в каталоге
[CatalogPage](../../src/pages/CatalogPage.tsx) грузит
[fetchPublicBrands](../../src/lib/public/brands.ts), рисует
[CatalogBrandFilter](../../src/components/catalog/CatalogBrandFilter.tsx) (чипы с
лого + счётчик), фильтрует товары по `?brand=<slug>` (матч по slug бренда из
текста товара или по имени). URL-параметр шарится со страницей брендов.

### Задача 4 — страница брендов
[src/pages/BrandsPage.tsx](../../src/pages/BrandsPage.tsx) (`/brands`) — сетка
карточек (лого, название, производитель, счётчик) → `/catalog?brand=slug`. Пункт
«Бренды» в [Header](../../src/components/layout/Header.tsx) (desktop + mobile),
lazy-роут в [App](../../src/App.tsx).

### Страница товара — бренд из таблицы
[src/lib/public/products.ts](../../src/lib/public/products.ts): `PUBLIC_SELECT`
embed'ит `brandRef:brands!products_brand_id_fkey`. `rowToProduct` берёт
`brand`/`manufacturer` из бренда (фоллбэк на текст), добавляет `brandSlug`,
`brandLogo` в [Product](../../src/types/product.ts). На странице товара
[ProductOrderPanel](../../src/components/product/ProductOrderPanel.tsx) —
кликабельный бренд-бейдж с логотипом → каталог по бренду.

### Задача 5 — тёмный hero
[HeroSection](../../src/components/home/HeroSection.tsx): десктопные `<h1>` и
подзаголовок → `text-foreground`, eyebrow → `text-primary`. Нижний градиент
переведён в светлый wash + поднята яркость `.hero-text-blur` в globals.css для
читаемости тёмного текста поверх фото.

### Задача 6 — фикс загрузки фото
Причина: клиент пускал любой `image/*`, но бакет `product-images` ограничен
`{jpeg,png,webp,avif,gif}` — HEIC с iPhone / bmp / svg / tiff отклонялись бакетом
с невнятной ошибкой. [src/lib/admin/storage.ts](../../src/lib/admin/storage.ts):
`assertUploadableImage` валидирует строго по whitelist бакета с понятным
сообщением; имя файла теперь коллизионно-устойчивое (`Date.now()` + рандом).
Применено в форме товара и в загрузке логотипа бренда.

## Связано
- [[data-model]]
- [[admin-phase2-plan]]
- [[2026-05-26-admin-site-catalog-sync]]
