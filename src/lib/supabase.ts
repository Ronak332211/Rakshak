import { createClient } from "@supabase/supabase-js";
import { Complaint } from "./supabaseTypes";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserComplaints(userId: string): Promise<Complaint[]> {
  const { data, error } = await supabase
    .from("complaints")
    .select(`
      *,
      category:categories(*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching complaints:", error);
    throw error;
  }

  return data || [];
} 