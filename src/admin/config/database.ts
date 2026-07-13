// database.ts
import { PostgrestError } from "@supabase/supabase-js";
import { supabase } from "../../services/supabase/client";
import { DatabaseItem, TableName, UserProfile } from "../types";

// ============================================================================
// 🗄️ CRUD OPERATIONS
// ============================================================================

/**
 * Détermine la colonne et direction de tri selon la table
 */
const getTableOrderConfig = (
  table: TableName,
): { column: string; ascending: boolean } => {
  const configs: Record<TableName, { column: string; ascending: boolean }> = {
    profiles: { column: "created_at", ascending: false },
    bureau: { column: "order", ascending: true },
    events: { column: "date", ascending: false },
    reports: { column: "date", ascending: false },
    albums: { column: "event_date", ascending: false },
  };

  return configs[table] || { column: "created_at", ascending: false };
};

export const getAll = async (table: TableName): Promise<DatabaseItem[]> => {
  if (!supabase) {
    console.error("[Database] ❌ Supabase client is not initialized");
    throw new Error("Supabase client is not initialized");
  }

  const { column, ascending } = getTableOrderConfig(table);

  console.log(
    `[Database] 📡 Fetching all from table "${table}" ordered by "${column}" (ascending: ${ascending})`,
  );

  // Vérifier si l'utilisateur est authentifié
  const {
    data: { session },
    error: authError,
  } = await supabase.auth.getSession();
  if (authError) {
    console.warn("[Database] ⚠️ Auth error:", authError);
  } else if (session?.user) {
    console.log(
      `[Database] 👤 Authenticated as: ${session.user.email} (ID: ${session.user.id})`,
    );
  } else {
    console.warn(
      "[Database] ⚠️ No authenticated session - operations may be blocked by RLS",
    );
  }

  const { data, error } = await supabase
    .from(table)
    .select("*")
    .order(column, { ascending });

  if (error) {
    const e = error as unknown as PostgrestError;
    console.error(`[Database] ❌ Error fetching from ${table}:`, {
      message: e.message,
      code: e.code,
      details: e.details,
      hint: e.hint,
    });
    throw new Error(`Failed to fetch from ${table}: ${e.message}`);
  }

  console.log(
    `[Database] ✅ Successfully fetched ${data?.length || 0} items from "${table}"`,
  );
  return (data as DatabaseItem[]) || [];
};

export const insertItem = async (
  table: TableName,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>[]> => {
  if (!supabase) {
    console.error("[Database] ❌ Supabase client is not initialized");
    throw new Error("Supabase client is not initialized");
  }

  // Nettoyer le payload : retirer l'id vide pour les insertions
  const cleanPayload = { ...payload };
  if (!cleanPayload.id || cleanPayload.id === "") {
    delete cleanPayload.id;
  }

  console.log(`[Database] ➕ Inserting into ${table}:`, cleanPayload);
  const { data, error } = await supabase
    .from(table)
    .insert([cleanPayload])
    .select();

  if (error) {
    const e = error as unknown as PostgrestError;
    console.error(`[Database] ❌ Error inserting into ${table}:`, e);
    throw new Error(e.message || "Error inserting item");
  }

  console.log(`[Database] ✅ Successfully inserted into ${table}`);
  return (data as Record<string, unknown>[]) || [];
};

export const updateItem = async (
  table: TableName,
  id: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>[]> => {
  if (!supabase) {
    console.error("[Database] ❌ Supabase client is not initialized");
    throw new Error("Supabase client is not initialized");
  }

  if (!id) {
    throw new Error("ID is required for update operation");
  }

  // Nettoyer le payload : retirer l'id pour éviter les conflits
  const updatePayload = { ...payload } as Record<string, unknown>;
  delete (updatePayload as Record<string, unknown>).id;

  console.log(`[Database] ✏️ Updating ${table} with id ${id}:`, updatePayload);
  const { data, error } = await supabase
    .from(table)
    .update(updatePayload)
    .eq("id", id)
    .select();

  if (error) {
    const e = error as unknown as PostgrestError;
    console.error(`[Database] ❌ Error updating ${table}:`, e);
    throw new Error(e.message || "Error updating item");
  }

  console.log(`[Database] ✅ Successfully updated ${table}`);
  return (data as Record<string, unknown>[]) || [];
};

export const deleteItem = async (
  table: TableName,
  id: string,
): Promise<void> => {
  if (!supabase) {
    console.error("[Database] ❌ Supabase client is not initialized");
    throw new Error("Supabase client is not initialized");
  }

  if (!id) {
    throw new Error("ID is required for delete operation");
  }

  console.log(`[Database] 🗑️ Deleting from ${table} with id ${id}`);
  const { error } = await supabase.from(table).delete().eq("id", id);

  if (error) {
    const e = error as unknown as PostgrestError;
    console.error(`[Database] ❌ Error deleting from ${table}:`, e);
    throw new Error(e.message || "Error deleting item");
  }

  console.log(`[Database] ✅ Successfully deleted from ${table}`);
};

// ============================================================================
// 📁 FILE UPLOAD
// ============================================================================

const generateFileName = (file: File): string => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const unique = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
  return `${unique}.${ext}`;
};

export const uploadFile = async (
  file: File,
  bucket: string = "amescao",
): Promise<string> => {
  if (!supabase) {
    console.error("[Upload] ❌ Supabase client is not initialized");
    throw new Error("Supabase client is not initialized");
  }

  if (!file) {
    console.error("[Upload] ❌ No file provided");
    throw new Error("Aucun fichier fourni");
  }

  // Vérifier la taille (limite à 10MB par défaut)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error(`Fichier trop volumineux. Limite: 10MB`);
  }

  const fileName = generateFileName(file);
  console.log(`[Upload] 📤 Uploading file: ${fileName} to bucket: ${bucket}`);
  console.log(`[Upload] 📊 File details: ${file.type}, ${file.size} bytes`);

  const { error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    const e = error as unknown as PostgrestError;
    console.error("[Upload] ❌ Upload error:", e);
    const statusInfo = e as unknown as { status?: number; statusCode?: number };
    console.error("[Upload] 🔍 Error details:", {
      message: e.message,
      status: statusInfo.status,
      statusCode: statusInfo.statusCode,
    });

    // Message d'erreur spécifique selon le type d'erreur
    if (e.message?.includes("bucket") || e.message?.includes("not found")) {
      throw new Error(
        `Le bucket "${bucket}" n'existe pas dans Supabase Storage. Créez-le d'abord.`,
      );
    }

    if (
      e.message?.includes("permission") ||
      e.message?.includes("Unauthorized")
    ) {
      throw new Error(
        `Vous n'avez pas les permissions pour uploader dans ce bucket. Vérifiez les RLS policies du bucket.`,
      );
    }

    const statusCode = statusInfo.status ?? statusInfo.statusCode;
    if (statusCode === 403) {
      throw new Error(
        `Accès refusé pour l'upload. Les RLS policies du bucket restreignent cet accès.`,
      );
    }

    throw new Error(e.message || "Upload error");
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  if (!data?.publicUrl) {
    console.error("[Upload] ❌ Could not get public URL");
    throw new Error("Impossible de récupérer l'URL publique du fichier");
  }

  console.log(`[Upload] ✅ File uploaded successfully: ${data.publicUrl}`);
  return data.publicUrl;
};

// ============================================================================
// 👤 USER PROFILE & AUTH
// ============================================================================

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  if (!supabase) {
    console.warn("[Auth] ⚠️ Supabase client is not initialized");
    return null;
  }

  try {
    const { data: authData, error: authError } =
      await supabase.auth.getSession();

    if (authError || !authData?.session?.user?.id) {
      console.warn("[Auth] ⚠️ No active session");
      return null;
    }

    const userId = authData.session.user.id;
    console.log(`[Auth] 🔍 Fetching profile for user: ${userId}`);

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) {
      console.warn("[Auth] ⚠️ Could not fetch profile:", error);
      return null;
    }

    const profile: UserProfile = {
      id: data.id,
      name: data.name || "",
      surname: data.surname || "",
      email: data.email || authData.session.user.email || "",
      photo: data.photo || undefined,
      role: data.role === "admin" ? "admin" : "member",
    };

    console.log(
      `[Auth] ✅ Profile loaded: ${profile.name} ${profile.surname} (${profile.role})`,
    );
    return profile;
  } catch (error) {
    console.error("[Auth] ❌ Exception fetching user profile:", error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur courant est admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const profile = await getCurrentUserProfile();
  return profile?.role === "admin";
}

export async function logoutUser(): Promise<void> {
  if (!supabase) {
    console.error("[Auth] ❌ Supabase client is not initialized");
    throw new Error("Supabase client is not initialized");
  }

  console.log("[Auth] 🚪 Signing out user");
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("[Auth] ❌ Logout error:", error);
    throw error;
  }

  console.log("[Auth] ✅ User logged out successfully");
}
