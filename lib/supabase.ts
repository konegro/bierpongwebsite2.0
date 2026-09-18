import { createClient } from "@supabase/supabase-js";

// URL + anon key come from .env.local (not committed). Schema: supabase/schema.sql.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
);
