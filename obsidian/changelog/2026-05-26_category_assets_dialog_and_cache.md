---
name: 2026-05-26-category-assets-dialog-and-cache
description: Анти-мигание фото категорий через localStorage-кэш + полноценный UI фото/иконки в окне редактирования категории
metadata:
  type: changelog
---

## Контекст
После предыдущего изменения ([[2026-05-26-category-icons-admin]]) при перезагрузке каталога на сайте мигало хардкоженное `/images/category.jpg`, а через 100-300мс подменялось на актуальное фото из БД. Также в админ-диалоге редактирования категории не было полей для фото и иконки — они были доступны только через миниатюры в общем списке.

## Что сделал

### localStorage-кэш категорий (анти-мигание)
- Добавил [src/lib/public/catalogueCache.ts](../../src/lib/public/catalogueCache.ts) — простой read/write API над `localStorage` ключом `med-x:public-categories:v1`. JSON-парсинг защищён try/catch, при corrupt-payload возвращает null.
- В [src/lib/public/catalogue.ts](../../src/lib/public/catalogue.ts) после успешного fetch пишем результат в кэш.
- На [HomePage](../../src/pages/HomePage.tsx), [CatalogPage](../../src/pages/CatalogPage.tsx), [CategoryPage](../../src/pages/CategoryPage.tsx) initial state теперь `readCachedCategories() ?? getCategories()` — на reload пользователь сразу видит прошлый Supabase-результат с загруженными фото, без мигания статики.
- Background re-fetch остался — кэш просто прогревает первый paint, актуализация всегда происходит.

### Фото и иконка в окне редактирования
В [src/pages/admin/AdminCategoriesPage.tsx](../../src/pages/admin/AdminCategoriesPage.tsx):
- Добавил локальный стейт `imageUrl`/`iconUrl` в `CategoryDialog`, сохраняются в payload по «Сохранить» (а не сразу при загрузке файла).
- Новый компонент `CategoryAssetField` — превью + кнопки «Загрузить/Заменить» и «Удалить». PNG-only enforcement для иконки. Файл сразу заливается в storage; если юзер передумает и закроет диалог без сохранения — в bucket'е останется orphan blob (приемлемо для редкой операции).
- Текстовая подсказка про миниатюры в списке заменена на этот UI. Миниатюры в списке остаются как быстрый shortcut и работают независимо.

## Связано
- [[data-model]]
- [[2026-05-26-category-icons-admin]]

## Не сделано (вопросы пользователя без правок)
- Пагинации товаров нет ни в админке (limit 100, без UI), ни на сайте (один запрос, лимит PostgREST 1000). Если позиций станет >100, потребуется добавить.
