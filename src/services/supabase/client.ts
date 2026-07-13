/**
 * Client-side Supabase Client (Browser)
 * Utilise @supabase/ssr pour synchroniser les cookies automatiquement
 */

import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}


export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// ceci va changer surement ! Re-exporter SUPABASE_CONFIG pour compatibilité avec les anciens modules (supabase.ts)
export const SUPABASE_CONFIG = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
  storageUrl: `${supabaseUrl}/storage/v1/object/public`,
} as const;

// Debug
if (typeof window !== "undefined") {
  console.log(
    "[Supabase Client] ✅ Initialized with createBrowserClient (SSR cookies)",
  );
}
