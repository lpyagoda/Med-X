---
name: 2026-05-26-category-icons-admin
description: Иконка категории редактируется из админки — два независимых файла (фото для главной + PNG-иконка для фильтра каталога)
metadata:
  type: changelog
---

## Контекст
Юзер заметил, что иконки в фильтре каталога ([src/components/catalog/CatalogCategoryNav.tsx](../../src/components/catalog/CatalogCategoryNav.tsx)) забиты хардом в [src/lib/categoryIcons.tsx](../../src/lib/categoryIcons.tsx) (словарь inline-SVG по ключу slug). Также фото категорий на главной странице ([src/components/catalog/CategoryGrid.tsx](../../src/components/catalog/CategoryGrid.tsx)) у всех было `/images/category.jpg` несмотря на то, что в БД уже есть поле `image_url` — оно просто не было заполнено.

Хотелось:
1. В админке у каждой категории — два загружаемых файла: фото (для главной) и иконка (для фильтра).
2. На сайте использовать загруженные файлы.
3. Сохранить совместимость со старыми хардовыми SVG для категорий, у которых иконка ещё не загружена.

## Что сделал

### Миграция БД
[supabase/migrations/20260526120000_category_icon.sql](../../supabase/migrations/20260526120000_category_icon.sql) — добавил `categories.icon_url text` (nullable). **Эту миграцию надо накатить на боевой Supabase отдельно.**

### Storage
В [src/lib/admin/storage.ts](../../src/lib/admin/storage.ts) добавил `uploadCategoryIcon(file, source)` — складывает в bucket `product-images` в фолдер `categories/icons/<slug>/`. На уровне функции проверка `file.type === "image/png"` — backend-side guard.

### Admin
- [src/lib/admin/types.ts](../../src/lib/admin/types.ts) и [src/lib/admin/categories.ts](../../src/lib/admin/categories.ts) — добавил `icon_url: string | null` в `CategoryRow` и `CategoryInput`.
- [src/pages/admin/AdminCategoriesPage.tsx](../../src/pages/admin/AdminCategoriesPage.tsx) — рефакторнул `CategoryThumb` в универсальный компонент с `kind: "image" | "icon"`. В каждой строке теперь две миниатюры: фото слева (любой image/*, белый-серый фон, `object-cover`), иконка справа (только PNG, белый фон, `object-contain` с padding). Обе с hover-upload, как раньше работало фото.
- Обновил `CategoryDialog` payload, `createCategory` в [AdminProductFormPage.tsx](../../src/pages/admin/AdminProductFormPage.tsx) (inline create) и в [excel-import.ts](../../src/lib/admin/excel-import.ts) — везде передаём `icon_url: null` по умолчанию.

### Public
- [src/types/category.ts](../../src/types/category.ts) — поле `icon?: string`.
- [src/lib/public/catalogue.ts](../../src/lib/public/catalogue.ts) — `icon_url` в select + маппинг в `category.icon`.
- [src/components/catalog/CatalogCategoryNav.tsx](../../src/components/catalog/CatalogCategoryNav.tsx) — `category.icon ? <img/> : fallbackIcon`. Хардкод SVG в `categoryIcons[slug]` остаётся как fallback и продолжает перекрашиваться под `currentColor` на hover/active. Загружаемые PNG не перекрашиваются (визуально выглядят корректно благодаря фону капсулы, который меняется).
- [src/components/catalog/CategoryGrid.tsx](../../src/components/catalog/CategoryGrid.tsx) — изменений не потребовалось: `CategoryCard` уже читает `category.image ?? visual.image`, просто `image_url` в БД до сих пор был пустой.

## Почему PNG, а не SVG
Юзер выбрал PNG-only при уточнении: проще, нет XSS-риска (SVG может содержать script-теги, требовался бы DOMPurify), нет проблем с `currentColor`-перекрашиванием для произвольной svg-структуры. Подсветка активного состояния остаётся за счёт фона капсулы.

## Связано
- [[data-model]]
- [[2026-05-26-admin-site-catalog-sync]]
