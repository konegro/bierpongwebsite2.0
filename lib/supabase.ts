import { createClient } from "@supabase/supabase-js";

// Direkt fest hinterlegt – immun gegen fehlerhafte Vercel-Umgebungsvariablen
const supabaseUrl = "https://wfdgnuthobguzsfcokut.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZGdudXRob2JndXpzZmNva3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MTQwMjIsImV4cCI6MjEwNDk5MDAyMn0.5h_CCuqPz2F0ZAOUHwP0nHg9Jbr1hhEuaMtTI2hMGIM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);