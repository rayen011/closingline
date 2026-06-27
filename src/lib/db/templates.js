import { supabase } from "@/lib/supabase";

/** All system templates (public read). */
export async function listTemplates() {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .order("category");
  if (error) throw error;
  return data;
}

/** A single system template by id. */
export async function getTemplate(id) {
  const { data, error } = await supabase
    .from("templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}
