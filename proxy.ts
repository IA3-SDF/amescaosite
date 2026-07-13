import { createServerClient } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { updateSession } from "./src/services/supabase/middleware";

type SupabaseCookieOptions = Record<string, unknown>;

interface SupabaseProfileResponse {
  data: { role?: string } | null;
  error: { message: string } | null;
}

export async function proxy(req: NextRequest) {
  // 1. Mettre à jour les cookies Supabase et récupérer l'utilisateur
  const { response, user } = await updateSession(req);
  const hasSession = !!user;

  const pathname = req.nextUrl.pathname;
  const url = req.nextUrl.clone();

  const adminRoutes = ["/admin"];

  console.log(`[Middleware] 🔍 ${pathname} | session: ${hasSession}`);

  // 2. Vérifier le rôle admin si nécessaire
  let isAdmin = false;
  if (hasSession && adminRoutes.some((route) => pathname.startsWith(route))) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return req.cookies.get(name)?.value;
          },
          set(name: string, value: string, options: SupabaseCookieOptions) {
            response.cookies.set({ name, value, ...options });
          },
          remove(name: string, options: SupabaseCookieOptions) {
            response.cookies.set({ name, value: "", ...options });
          },
        },
      },
    );

    // Récupérer le profil utilisateur pour vérifier le rôle avec timeout
    const profilePromise = supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Profile fetch timeout")), 5000),
    );

    try {
      const { data: profile, error: profileError } = (await Promise.race([
        profilePromise,
        timeoutPromise,
      ])) as SupabaseProfileResponse;

      if (profileError) {
        console.error("[Middleware] Profile fetch error:", profileError);
        isAdmin = false;
      } else if (profile) {
        isAdmin = profile.role === "admin";
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(
        "[Middleware] Profile fetch timeout or error:",
        errorMessage,
      );
      isAdmin = false;
    }
  }

  // 3. Protection admin uniquement
  if (adminRoutes.some((route) => pathname.startsWith(route))) {
    if (!hasSession || !isAdmin) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
    return response;
  }

  // 4. Toutes les autres pages sont publiques (pas de redirection)
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
