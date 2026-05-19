import { supabase } from "@/lib/supabase/client";

export type OrderStatus =
  | "new"
  | "in_progress"
  | "paid"
  | "shipped"
  | "done"
  | "cancelled";

export type OrderType = "cart" | "quick";

export type OrderRow = {
  id: string;
  number: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string | null;
  comment: string | null;
  total: number | string | null;
  items_count: number;
  type: OrderType;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  product_slug: string | null;
  product_title: string;
  product_image: string | null;
  unit_price: number | string | null;
  price_label: string | null;
  quantity: number;
};

export async function listOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

export async function getOrderWithItems(
  id: string,
): Promise<{ order: OrderRow; items: OrderItemRow[] }> {
  const [orderResult, itemsResult] = await Promise.all([
    supabase.from("orders").select("*").eq("id", id).single(),
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: true }),
  ]);
  if (orderResult.error) throw orderResult.error;
  if (itemsResult.error) throw itemsResult.error;
  return {
    order: orderResult.data as OrderRow,
    items: (itemsResult.data ?? []) as OrderItemRow[],
  };
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteOrder(id: string): Promise<void> {
  const { error } = await supabase.from("orders").delete().eq("id", id);
  if (error) throw error;
}
