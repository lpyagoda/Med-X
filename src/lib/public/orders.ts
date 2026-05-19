import { supabase } from "@/lib/supabase/client";
import type { CartItem } from "@/contexts/CartContext";

export type OrderType = "cart" | "quick";

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress?: string;
  comment?: string;
  type: OrderType;
  items: CartItem[];
};

export type CreatedOrder = {
  id: string;
  number: number;
};

export async function createOrder(input: CreateOrderInput): Promise<CreatedOrder> {
  if (input.items.length === 0) {
    throw new Error("Корзина пуста");
  }

  const total = input.items.reduce(
    (sum, row) => sum + (row.unitPrice != null ? row.unitPrice * row.quantity : 0),
    0,
  );
  const itemsCount = input.items.reduce((sum, row) => sum + row.quantity, 0);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      customer_email: input.customerEmail ?? null,
      delivery_address: input.deliveryAddress ?? null,
      comment: input.comment ?? null,
      total: total > 0 ? total : null,
      items_count: itemsCount,
      type: input.type,
    })
    .select("id, number")
    .single();

  if (orderError) throw orderError;
  const created = order as { id: string; number: number };

  const itemsPayload = input.items.map((row) => ({
    order_id: created.id,
    product_id: row.productId.length === 36 ? row.productId : null, // only UUIDs go in; static-data string ids stay null
    product_slug: row.slug || null,
    product_title: row.title,
    product_image: row.image || null,
    unit_price: row.unitPrice,
    price_label: row.priceLabel || null,
    quantity: row.quantity,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(itemsPayload);
  if (itemsError) throw itemsError;

  return created;
}
