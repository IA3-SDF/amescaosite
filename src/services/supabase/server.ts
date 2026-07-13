/**
 * Server-side Supabase Client
 * Utilisé UNIQUEMENT côté serveur pour les opérations administrateur
 * avec la clé SERVICE_ROLE (pleins droits, ne pas exposer au client)
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
  );
}

/**
 * Client administrateur avec pleins droits
 * ⚠️ NE JAMAIS exposer au client ! Réservé aux Server Actions et Middleware
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log("[Supabase Admin] ✅ Initialized with SERVICE_ROLE_KEY");
