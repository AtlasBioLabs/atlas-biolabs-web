import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function hasSupabaseEnv() {
  return Boolean(
    supabaseUrl &&
      supabaseUrl.trim().length > 0 &&
      supabasePublishableKey &&
      supabasePublishableKey.trim().length > 0
  );
}

export function createServerSupabaseClient(): SupabaseClient {
  if (!hasSupabaseEnv()) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createClient(supabaseUrl!, supabasePublishableKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch,
    },
  });
}
