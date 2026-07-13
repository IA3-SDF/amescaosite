"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type SupabaseCookieOptions = Record<string, unknown>;

/**
 * Fonction utilitaire pour créer un client Supabase côté serveur
 */
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
        cookieStore.set({ name, value: "", ...options });
      },
    },
  });
}

export interface CreateProfileData {
  email?: string;
  name?: string;
  surname?: string;
  photo?: string | null;
}

/**
 * Server Action - Crée un profil utilisateur
 * Appelée après une authentification réussie (OAuth ou Email/Password)
 */
export async function createUserProfile(data: CreateProfileData) {
  try {
    const supabase = await getSupabaseServerClient();

    // Récupère l'utilisateur actuel
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error("[CreateProfile] Auth error:", authError);
      return { success: false, error: "Authentication failed" };
    }

    // Vérifie si le profil existe déjà
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (existingProfile) {
      console.log("[CreateProfile] Profile already exists for user:", user.id);
      return { success: true, existing: true };
    }

    if (checkError && checkError.code !== "PGRST116") {
      // PGRST116 = no rows returned (attendu si le profil n'existe pas)
      console.error("[CreateProfile] Check error:", checkError);
      return { success: false, error: checkError.message };
    }

    // Crée le profil utilisateur
    const profileData = {
      id: user.id,
      email: data.email || user.email || "",
      name: data.name || "",
      surname: data.surname || "",
      photo: data.photo || null,
      role: "member", // Rôle par défaut : "member" (pas admin)
      created_at: new Date().toISOString(),
    };

    const { data: newProfile, error: insertError } = await supabase
      .from("profiles")
      .insert([profileData])
      .select("*")
      .single();

    if (insertError) {
      console.error("[CreateProfile] Insert error:", insertError);
      return { success: false, error: insertError.message };
    }

    console.log("[CreateProfile] ✅ Profile created successfully:", user.id);
    return { success: true, data: newProfile };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("[CreateProfile] Error:", errorMessage, err);
    return { success: false, error: errorMessage };
  }
}
