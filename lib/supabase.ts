import { createClient } from "@supabase/supabase-js";

const DEFAULT_URL = "https://wfdgnuthobguzsfcokut.supabase.co";
const DEFAULT_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZGdudXRob2JndXpzZmNva3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk0MTQwMjIsImV4cCI6MjEwNDk5MDAyMn0.5h_CCuqPz2F0ZAOUHwP0nHg9Jbr1hhEuaMtTI2hMGIM";

function cleanValue(val: string | undefined, fallback: string): string {
  if (!val) return fallback;
  // Entfernt versehentliche Anführungszeichen, Whitespace und Key-Prefixe
  let cleaned = val.replace(/['"]/g, "").trim();
  if (cleaned.includes("=")) {
    cleaned = cleaned.split("=").pop()?.trim() || "";
  }
  if (!cleaned || cleaned === "undefined" || cleaned === "null") {
    return fallback;
  }
  return cleaned;
}

function getValidSupabaseUrl(): string {
  let url = cleanValue(process.env.NEXT_PUBLIC_SUPABASE_URL, DEFAULT_URL);
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  return url;
}

export const supabase = createClient(
  getValidSupabaseUrl(),
  cleanValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, DEFAULT_KEY)
);