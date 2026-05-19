import { supabase } from "@/lib/supabase/client";

export type LeadSource =
  | "consultation"
  | "lead_modal"
  | "contacts_page"
  | "product_order";

export type CreateLeadInput = {
  name: string;
  phone: string;
  email?: string;
  comment?: string;
  source: LeadSource;
  pageUrl?: string;
};

export async function createLead(input: CreateLeadInput): Promise<{ id: string }> {
  const { data, error } = await supabase
    .from("leads")
    .insert({
      name: input.name,
      phone: input.phone,
      email: input.email ?? null,
      comment: input.comment ?? null,
      source: input.source,
      page_url:
        input.pageUrl ??
        (typeof window !== "undefined" ? window.location.href : null),
    })
    .select("id")
    .single();

  if (error) throw error;
  return data as { id: string };
}
