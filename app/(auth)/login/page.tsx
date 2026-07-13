"use client";

import { DM_Sans, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DotLoader,
  GoogleLogo,
} from "../../../src/components/auth/SharedAuthComponents";
import { getAuthRedirectUrl } from "../../../src/lib/auth";
import { supabase } from "../../../src/services/supabase/client";
import { translateAuthError } from "../../../src/utils/authErrors";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const isRedirecting = useRef(false);

  const handleRedirect = useCallback(() => {
    if (isRedirecting.current) return;
    isRedirecting.current = true;
    router.push("/");
  }, [router]);

  useEffect(() => {
    if (!supabase) return;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session && !isRedirecting.current) {
        handleRedirect();
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session && !isRedirecting.current) {
          handleRedirect();
        }
      },
    );

    return () => authListener.subscription?.unsubscribe();
  }, [handleRedirect]);

  useEffect(() => {
    const updateDevice = () => setIsMobile(window.innerWidth < 768);
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Identifiants incorrects.";
      setError(translateAuthError(message));
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      const redirectTo = getAuthRedirectUrl(
        "/auth/callback",
        window.location.href,
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Erreur de connexion Google.";
      setError(translateAuthError(message));
      setGoogleLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8 ${dmSans.className}`}
    >
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          {!isMobile && (
            <div className="hidden rounded-[32px] border border-slate-200/80 bg-white/60 p-8 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl lg:flex lg:flex-col lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">
                  Accès membre
                </p>
                <h1
                  className={`mt-5 text-4xl font-semibold tracking-[0.08em] text-slate-900 ${instrumentSerif.className}`}
                >
                  AM.E.S.C.A.O
                </h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                  Connectez-vous à votre espace sécurisé avec une expérience
                  simple, élégante et adaptée à tous vos appareils.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-950/5 p-4 text-sm text-slate-600">
                Utilisez votre e-mail ou votre connexion Google pour entrer
                rapidement.
              </div>
            </div>
          )}

          <div className="w-full max-w-[430px] justify-self-center rounded-[32px] border border-slate-200/80 bg-white/70 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-8 lg:max-w-none">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Connexion
              </p>
              <h2
                className={`mt-3 text-3xl font-semibold tracking-[0.08em] text-slate-900 ${instrumentSerif.className}`}
              >
                AM.E.S.C.A.O
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Bienvenue, connectez-vous à votre espace.
              </p>
            </div>

            {error && (
              <div
                id="login-error"
                role="alert"
                aria-live="assertive"
                className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              aria-busy={googleLoading}
              aria-disabled={googleLoading}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <DotLoader />
              ) : (
                <>
                  <GoogleLogo /> Continuer avec Google
                </>
              )}
            </button>

            <div className="my-6 flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <span>ou</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500"
                >
                  Adresse électronique
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="votre@email.com"
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500"
                >
                  Mot de passe
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="flex justify-end pt-1">
                <Link
                  href="/forgot-password"
                  className="text-sm text-slate-500 transition hover:text-slate-800"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-disabled={loading}
                className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <DotLoader variant="current" className="text-white" />
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
              Pas encore membre ?
              <Link
                href="/signup"
                className="ml-2 font-semibold text-slate-900 transition hover:text-slate-700"
              >
                S&apos;inscrire
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
