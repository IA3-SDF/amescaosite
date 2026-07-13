import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createUserProfile } from "../../../src/actions/createProfile";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const nextParam = requestUrl.searchParams.get("next");
  const next =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/";

  if (!code) {
    console.error(
      "[Auth Callback] Aucun code d'authentification trouvé dans l'URL",
    );
    return NextResponse.redirect(
      new URL("/login?error=oauth_no_code", request.url),
    );
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignorer dans les route handlers (Server Components context)
          }
        },
      },
    },
  );

  try {
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error(
        "[Auth Callback] Échec de l'échange du code:",
        error.message,
      );
      return NextResponse.redirect(
        new URL(
          `/login?error=oauth_exchange_failed&message=${encodeURIComponent(error.message)}`,
          request.url,
        ),
      );
    }

    // ✅ Créer le profil après l'authentification réussie
    if (data?.user) {
      console.log("[Auth Callback] Creating profile for user:", data.user.id);

      const profileResult = await createUserProfile({
        email: data.user.email,
        name: data.user.user_metadata?.name || "",
        surname: data.user.user_metadata?.surname || "",
        photo: data.user.user_metadata?.picture || null,
      });

      if (!profileResult.success) {
        console.error(
          "[Auth Callback] Profile creation failed:",
          profileResult.error,
        );
        // Ne pas bloquer la redirection si le profil échoue (l'utilisateur est déjà auth)
      }
    }

    return NextResponse.redirect(new URL(next, request.url));
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[Auth Callback] Exception critique:", errorMessage);
    return NextResponse.redirect(
      new URL("/login?error=oauth_exception", request.url),
    );
  }
}
