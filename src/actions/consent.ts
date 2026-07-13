"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type SupabaseCookieOptions = Record<string, unknown>;

// Fonction utilitaire pour centraliser la création du client Supabase
async function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase environment variables");
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: SupabaseCookieOptions) {
        cookieStore.set({ name, value, ...options });
      },
      remove(name: string, options: SupabaseCookieOptions) {
        // Correction : On force maxAge à 0 pour détruire proprement le cookie
        cookieStore.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}

/**
 * Server Action - Enregistrer le consentement RGPD
 */
export async function saveUserConsent(consentData: {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}) {
  try {
    const supabase = await getSupabaseServerClient();

    // Récupération sécurisée de l'utilisateur (bénéficie des cookies synchronisés par le middleware)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.warn(
        "[Consent] No authenticated session. Skipping server-side consent save.",
        authError,
      );
      return { success: true, authenticated: false, data: null };
    }

    // Insertion / Upsert du consentement
    const { data, error } = await supabase
      .from("user_consents")
      .insert({
        user_id: user.id,
        analytics: consentData.analytics,
        marketing: consentData.marketing,
        preferences: consentData.preferences,
        consent_version: "1.0",
      })
      .select("*")
      .single();

    if (error) {
      const isDuplicate =
        error.message?.toLowerCase().includes("duplicate") ||
        error.code === "23505";
      if (isDuplicate) {
        console.log(
          "[Consent] Consent record already exists for user:",
          user.id,
        );
        return { success: true, updated: true };
      }
      console.error("[Consent] Database error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[Consent] Error saving consent:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Server Action - Récupérer le consentement de l'utilisateur
 */
export async function getUserConsent() {
  try {
    const supabase = await getSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    // Si pas de session ou erreur d'auth, l'utilisateur n'est pas connecté
    if (authError || !user) {
      return { success: true, authenticated: false, data: null };
    }

    const { data, error } = await supabase
      .from("user_consents")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = Aucun résultat (normal au premier chargement)
      console.error("[Consent] Error fetching consent:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      authenticated: true,
      data: data || null,
    };
  } catch (err) {
    console.error("[Consent] Error in getUserConsent:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
