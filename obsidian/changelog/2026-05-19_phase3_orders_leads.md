---
name: 2026-05-19-phase3-orders-leads
description: Корзина, чекаут, 1-клик, заявки/заказы в админке, XLSX-экспорт, галерея на странице товара, плашки подкатегорий
metadata:
  type: changelog
---

## Что сделано

### Публичный сайт
- **Галерея фото на странице товара** — `src/components/product/ProductGallery.tsx`. Главное фото + миниатюры, клик меняет активное. Гидратация из `product_images` (Supabase) с fallback на `product.image_url`.
- **Похожие товары — из той же категории** — `RelatedProducts` уже фильтровал по `categorySlug`. Теперь данные тянутся через `fetchRelatedProducts` из `src/lib/public/products.ts`.
- **Корзина** — `src/contexts/CartContext.tsx` с persistence в LocalStorage. Провайдер в `main.tsx` обёрнут вокруг `LeadModalProvider`.
- **Иконка корзины в шапке** — `src/components/layout/CartButton.tsx`. Бейдж со счётчиком, ссылка на `/cart`.
- **Страница корзины** — `/cart` (`src/pages/CartPage.tsx`). Список товаров, изменение количества, удаление, очистка, переход в чекаут.
- **Чекаут** — `/checkout` (`src/pages/CheckoutPage.tsx`). Только имя + телефон. На submit → `orders` + `order_items` в Supabase, выдаёт номер заказа.
- **Купить в 1 клик** — `src/components/product/QuickOrderModal.tsx`. Имя+телефон, количество из правой панели, тип заказа `quick`. Уходит в ту же таблицу `orders`.
- **На странице товара** — кнопка «Купить» теперь «В корзину», под ней «Купить в 1 клик», ниже ссылка «Перейти в корзину».
- **Все формы заявок** (`submitConsultationForm`, `submitProductOrder` в `src/lib/api.ts`) пишут в таблицу `leads` через `src/lib/public/leads.ts`.

### Подкатегории на странице категории
- Убран белый блок-обёртка, плашки увеличены ~20% (`px-[1.15rem] py-[0.625rem]`, текст `0.95rem`), `flex flex-wrap gap-2.5` — переносятся на следующий ряд при упоре в край.

### Админка
- **Раздел «Заказы»** — `/admin/orders` (список) + `/admin/orders/:id` (детали с позициями, смена статуса, удаление). Файлы: `AdminOrdersListPage.tsx`, `AdminOrderDetailPage.tsx`, `src/lib/admin/orders.ts`.
- **Раздел «Заявки»** — `/admin/leads`. Файлы: `AdminLeadsPage.tsx`, `src/lib/admin/leads.ts`. Смена статуса, удаление, источник заявки (consultation / lead_modal / contacts_page / product_order).
- **Сайдбар** — добавлены пункты «Заказы» и «Заявки», иконки `ClipboardList` и `Inbox` из `lucide-react`.
- **XLSX-экспорт каталога** — кнопка «Экспорт XLSX» в шапке `/admin/products`. Файл: `src/lib/admin/products-export.ts`. Использует уже подключённый `xlsx`, формат `.xlsx` (UTF-8 нативный). Колонки: артикул, slug, название, бренд, производитель, slug+title категории/подкатегории, цена, описание, наличие, главное фото, характеристики (склейкой), создан.

### База данных
- Новая миграция `supabase/migrations/20260519152039_orders_and_leads.sql`:
  - `leads` — id, name, phone, email, comment, source, page_url, status, timestamps. RLS: anon INSERT + authenticated ALL.
  - `orders` — номер из sequence `orders_number_seq` (старт 1000), customer_*, total, items_count, type (`cart`|`quick`), status. RLS: anon INSERT + authenticated ALL.
  - `order_items` — снапшоты товаров (product_slug, product_title, product_image, unit_price, price_label, quantity). FK на `products` через `on delete set null`, FK на `orders` через `on delete cascade`.

## Что важно знать
- Корзина live в LocalStorage (ключ `med-x-cart-v1`), пишется в БД только в момент чекаута.
- `order_items.product_id` пишется только если у товара UUID (т.е. он живёт в Supabase). Для статической витрины (старые `src/data/products.ts` со строковыми id) пишем `null`, но `product_title`/`product_slug`/`product_image` снапшотятся — заказ остаётся читаемым.
- TS-чек проходит (`npx tsc -b`).

## Связано
- [[data-model]] — нужно дописать `leads` / `orders` / `order_items`
- [[routing-map]] — добавить `/cart`, `/checkout`, `/admin/orders`, `/admin/orders/:id`, `/admin/leads`
- [[admin-phase2-plan]]
