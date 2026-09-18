import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://wfdgnuthobguzsfcokut.supabase.co";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZGdudXRob2JndXpzZmNva3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MTQwMjIsImV4cCI6MjEwNDk5MDAyMn0.5h_CCuqPz2F0ZAOUHwP0nHg9Jbr1hhEuaMtTI2hMGIM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);