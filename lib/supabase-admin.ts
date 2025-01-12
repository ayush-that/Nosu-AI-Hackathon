import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "path";

// Load environment variables first
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Get environment variables after they're loaded
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL");
}
if (!supabaseAnonKey) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
