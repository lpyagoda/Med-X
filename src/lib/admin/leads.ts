import { supabase } from "@/lib/supabase/client";

export type LeadStatus = "new" | "in_progress" | "done" | "cancelled";

export type LeadRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  comment: string | null;
  source: string;
  page_url: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export async function listLeads(): Promise<LeadRow[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(500);
  if (error) throw error;
  return (data ?? []) as LeadRow[];
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) throw error;
}
