---
name: 2026-05-26-search-and-pagination
description: Релевантный поиск товаров (primary/secondary поля + ранжирование) и пагинация в каталоге (20) и админ-листинге (50)
metadata:
  type: changelog
---

## Контекст
Юзер показал кейс: вбил «наконеч» в поиск по каталогу — в выдаче рядом с реальными наконечниками висела стоматологическая установка SKEMA 8. Причина — в [src/lib/catalogSearch.ts](../../src/lib/catalogSearch.ts) `matchesProductQuery` искал substring по всем восьми полям подряд (включая `description` и `characteristics`), а в описании SKEMA фигурирует слово «наконечник» как ссылка на комплектацию. Также не было пагинации ни в каталоге, ни в админ-листинге товаров — юзер запросил 20/стр и 50/стр соответственно.

## Что сделал

### Поиск с ранжированием
В [src/lib/catalogSearch.ts](../../src/lib/catalogSearch.ts):
- Поля разделены на **primary** (`title`, `brand`, `manufacturer`, `categoryName`, `subcategoryName`) и **secondary** (`shortDescription`, `description`, characteristics).
- Запрос бьётся на токены по пробелам, AND-семантика.
- Каждый токен **обязан** совпасть хотя бы в одном primary-поле — иначе товар выкидывается. Secondary-поля только повышают score, но в одиночку пропустить товар не могут.
- Word-boundary бонус: совпадение в начале поля или после пробела добавляет +10. «наконеч» теперь сильнее ранжирует «Наконечник» (начало title) над просто substring-вхождением.
- Экспортирована `scoreProductForQuery()` для использования в UI-сортировке.

В [src/components/catalog/ProductSearch.tsx](../../src/components/catalog/ProductSearch.tsx):
- При наличии запроса результаты сортируются по убыванию score.

### Пагинация в каталоге (20/стр)
- [src/components/catalog/Pagination.tsx](../../src/components/catalog/Pagination.tsx) — новый компонент с sliding-window нумерацией (1 … N), prev/next, accessible.
- [ProductSearch](../../src/components/catalog/ProductSearch.tsx) теперь slice'ит по 20 и показывает Pagination внизу, когда страниц > 1. При смене запроса или входных products сбрасывается на 1. При смене страницы scroll-to-top.

### Пагинация в админке (50/стр)
В [src/pages/admin/AdminProductsListPage.tsx](../../src/pages/admin/AdminProductsListPage.tsx):
- Хардкод `limit: 100` заменён на `PAGE_SIZE = 50` и `offset = (page - 1) * PAGE_SIZE` (Supabase уже умеет offset через PostgREST range).
- Под таблицей — строка «Страница X из Y · показано N–M из Total» + кнопки prev/next.
- Reset на page 1 при изменении фильтра по категории или поискового запроса.

## Связано
- [[2026-05-26-admin-site-catalog-sync]]
