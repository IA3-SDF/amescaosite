/**
 * Middleware helper pour créer un client Supabase côté serveur
 * et gérer le refresh/stockage des cookies
 */
import { createServerClient } from "@supabase/ssr";
import type { User } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

type SupabaseCookieOptions = Record<string, unknown>;

interface UpdateSessionResult {
  response: NextResponse;
  user: User | null;
}

export const updateSession = async (
  request: NextRequest,
): Promise<UpdateSessionResult> => {
  // 1. On initialise une réponse par défaut
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: SupabaseCookieOptions) {
          // Étape cruciale : on injecte le cookie dans la requête en cours
          request.cookies.set({ name, value, ...options });

          // On recrée la réponse pour y attacher les nouveaux en-têtes de la requête
          response = NextResponse.next({
            request: { headers: request.headers },
          });

          // On définit le cookie dans la réponse pour le navigateur du client
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: SupabaseCookieOptions) {
          // Même logique pour la suppression, en forçant l'expiration immédiate (maxAge: 0)
          request.cookies.set({ name, value: "", ...options });

          response = NextResponse.next({
            request: { headers: request.headers },
          });

          response.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    },
  );

  // Récupère l'utilisateur et déclenche le rafraîchissement des cookies si nécessaire
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
};
