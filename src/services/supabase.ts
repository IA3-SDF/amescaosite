import { getAuthRedirectUrl } from "../lib/auth";
import {
  AlbumData,
  BoardMemberData,
  EventData,
  ReportData,
  UserProfile,
} from "../types";
import { supabase } from "./supabase/client";

/* ───────────────────────────────────────────────────────────
   Utilitaires
   ─────────────────────────────────────────────────────────── */

/**
 * Construit l'URL publique d'un fichier Supabase Storage.
 * Accepte les URLs complètes (déjà stockées) ou les chemins relatifs.
 */
export const getMediaUrl = (path?: string | null): string => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("//")) return path;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!supabaseUrl) return path;

  // Nettoie les slashs superflus
  const base = supabaseUrl.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");
  return `${base}/storage/v1/object/public/amescao/${cleanPath}`;
};

interface TextChild {
  text?: string;
}

interface ContentBlock {
  children?: TextChild[];
  text?: string;
}

/**
 * Convertit les blocs de contenu rich-text (JSON Supabase) en texte simple.
 */
export const renderBlocksToText = (content: unknown): string => {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((block: unknown) => {
        if (typeof block === "string") return block;
        if (block && typeof block === "object") {
          const b = block as ContentBlock;
          if (b.children) {
            return b.children.map((child) => child?.text ?? "").join("");
          }
        }
        return "";
      })
      .join("\n");
  }
  if (typeof content === "object" && content !== null) {
    const obj = content as Record<string, unknown>;
    if (Array.isArray(obj.blocks)) {
      return (obj.blocks as ContentBlock[])
        .map((block) => block?.text ?? "")
        .join("\n");
    }
    return JSON.stringify(content);
  }
  return "";
};

/**
 * Gestionnaire d'erreur centralisé.
 */
const handleError = (context: string, error: unknown): void => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[Supabase Service] ${context}:`, message, error);
};

/* ───────────────────────────────────────────────────────────
   Événements
   ─────────────────────────────────────────────────────────── */

interface RawEventItem {
  id: string;
  title?: string | null;
  date?: string | null;
  location?: string | null;
  content?: string | null;
  cover_photo?: string | null;
  other_photos?: string[] | null;
}

export async function getEvents(): Promise<EventData[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    handleError("getEvents", error);
    return [];
  }

  return ((data as RawEventItem[]) ?? []).map((item) => ({
    id: item.id,
    title: item.title ?? "",
    date: item.date ?? "",
    location: item.location ?? "",
    description: item.content ?? "",
    content: item.content ?? "",
    cover_photo: item.cover_photo || undefined,
    other_photos: item.other_photos ?? [],
  }));
}

/* ───────────────────────────────────────────────────────────
   Albums
   ─────────────────────────────────────────────────────────── */

interface RawAlbumItem {
  id: string;
  event_title?: string | null;
  event_date?: string | null;
  photos?: string[] | null;
}

export async function getAlbums(): Promise<AlbumData[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("albums")
    .select("*")
    .order("event_date", { ascending: false });

  if (error) {
    handleError("getAlbums", error);
    return [];
  }

  return ((data as RawAlbumItem[]) ?? []).map((item) => ({
    id: item.id,
    event_title: item.event_title ?? "",
    event_date: item.event_date ?? "",
    photos: item.photos ?? [],
  }));
}

/* ───────────────────────────────────────────────────────────
   Rapports
   ─────────────────────────────────────────────────────────── */

interface RawReportItem {
  id: string;
  title?: string | null;
  date?: string | null;
  content?: string | null;
  document_pdf_link?: string | null;
}

export async function getReports(): Promise<ReportData[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    handleError("getReports", error);
    return [];
  }

  return ((data as RawReportItem[]) ?? []).map((item) => ({
    id: item.id,
    title: item.title ?? "",
    date: item.date ?? "",
    year: item.date ? new Date(item.date).getFullYear().toString() : "",
    content: item.content ?? "",
    document_pdf_link: item.document_pdf_link || undefined,
  }));
}

/* ───────────────────────────────────────────────────────────
   Bureau
   ─────────────────────────────────────────────────────────── */

interface RawBoardMemberItem {
  id: string;
  name?: string | null;
  surname?: string | null;
  order?: number | null;
  role?: string | null;
  photo?: string | null;
  biography?: string | null;
}

export async function getBoardMembers(): Promise<BoardMemberData[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("bureau")
    .select("*")
    .order("order", { ascending: true });

  if (error) {
    handleError("getBoardMembers", error);
    return [];
  }

  return ((data as RawBoardMemberItem[]) ?? []).map((item) => ({
    id: item.id,
    name: item.name ?? "",
    surname: item.surname ?? "",
    order: item.order ?? 0,
    role: item.role ?? "",
    photo: item.photo || undefined,
    biography: item.biography ?? "",
  }));
}

/* ───────────────────────────────────────────────────────────
   Profil Utilisateur
   ─────────────────────────────────────────────────────────── */

interface RawProfileData {
  id: string;
  name?: string | null;
  surname?: string | null;
  email?: string | null;
  photo?: string | null;
  role?: string | null;
}

/**
 * Récupère le profil de l'utilisateur connecté.
 * Fallback sur les métadonnées Google Auth si la table profiles
 * n'est pas encore synchronisée.
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!supabase) return null;

  try {
    const { data: authData, error: authError } =
      await supabase.auth.getSession();

    if (authError) {
      handleError("getCurrentUserProfile — session", authError);
      return null;
    }
    if (!authData?.session?.user) return null;

    const authUser = authData.session.user;

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    const metadata = authUser.user_metadata ?? {};
    const googleAvatarUrl =
      typeof metadata.avatar_url === "string" ? metadata.avatar_url : undefined;

    // Fallback Google Auth si profil absent
    if (profileError || !profileData) {
      return {
        id: authUser.id,
        name: String(metadata.full_name ?? metadata.name ?? "Utilisateur"),
        surname: "",
        email: authUser.email ?? "",
        photo: googleAvatarUrl,
        googleAvatarUrl,
        role: "member",
      };
    }

    const typedProfile = profileData as RawProfileData;

    return {
      id: typedProfile.id,
      name:
        typedProfile.name ??
        String(metadata.full_name ?? metadata.name ?? "Utilisateur"),
      surname: typedProfile.surname ?? "",
      email: typedProfile.email ?? authUser.email ?? "",
      photo: typedProfile.photo || undefined,
      googleAvatarUrl,
      role: typedProfile.role ?? "member",
    };
  } catch (error) {
    handleError("getCurrentUserProfile — exception", error);
    return null;
  }
}

/**
 * Met à jour le profil de l'utilisateur connecté.
 */
export async function updateUserProfile(
  profile: Partial<UserProfile>,
): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { data: authData, error: authError } =
      await supabase.auth.getSession();

    if (authError || !authData?.session?.user?.id) {
      handleError(
        "updateUserProfile — session",
        authError ?? "Session manquante",
      );
      return false;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        name: profile.name,
        surname: profile.surname,
        photo: profile.photo,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authData.session.user.id);

    if (error) {
      handleError("updateUserProfile — update", error);
      return false;
    }

    return true;
  } catch (error) {
    handleError("updateUserProfile — exception", error);
    return false;
  }
}

/* ───────────────────────────────────────────────────────────
   Authentification
   ─────────────────────────────────────────────────────────── */

/**
 * Déclenche le flux OAuth Google Auth.
 * Gère automatiquement le contexte Localhost vs Production.
 */
export async function signInWithGoogle(): Promise<boolean> {
  if (!supabase) return false;

  try {
    const redirectTo = getAuthRedirectUrl(
      "/auth/callback",
      window.location.href,
    );

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    return true;
  } catch (error) {
    handleError("signInWithGoogle", error);
    return false;
  }
}

/**
 * Déconnecte l'utilisateur et redirige proprement.
 */
export async function signOutUser(): Promise<boolean> {
  if (!supabase) return false;

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    return true;
  } catch (error) {
    handleError("signOutUser", error);
    return false;
  }
}

/**
 * Récupère la session active de manière sécurisée.
 */
export async function getActiveSession() {
  if (!supabase) return { session: null, user: null };

  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      handleError("getActiveSession", error);
      return { session: null, user: null };
    }
    return {
      session: data.session,
      user: data.session?.user ?? null,
    };
  } catch (error) {
    handleError("getActiveSession — exception", error);
    return { session: null, user: null };
  }
}

/**
 * Vérifie si l'utilisateur est authentifié.
 */
export async function isAuthenticated(): Promise<boolean> {
  const { session } = await getActiveSession();
  return session !== null;
}

/**
 * Récupère l'utilisateur actuel.
 */
export async function getCurrentUser() {
  const { user } = await getActiveSession();
  return user;
}

/**
 * Réinitialise le mot de passe par email.
 */
export async function resetPassword(email: string): Promise<boolean> {
  if (!supabase) return false;

  try {
    const redirectTo = getAuthRedirectUrl(
      "/auth/callback",
      window.location.href,
    );

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    handleError("resetPassword", error);
    return false;
  }
}
