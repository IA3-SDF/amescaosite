"use client";

import { DM_Sans, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createUserProfile } from "../../../src/actions/createProfile";
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

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const isRedirecting = useRef(false);

  useEffect(() => {
    if (!supabase) return;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session && !isRedirecting.current) {
        isRedirecting.current = true;
        router.push("/");
      }
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session && !isRedirecting.current) {
          isRedirecting.current = true;
          router.push("/");
        }
      },
    );

    return () => authListener.subscription?.unsubscribe();
  }, [router]);

  useEffect(() => {
    const updateDevice = () => setIsMobile(window.innerWidth < 768);
    updateDevice();
    window.addEventListener("resize", updateDevice);
    return () => window.removeEventListener("resize", updateDevice);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const redirectTo = getAuthRedirectUrl(
        "/auth/callback",
        window.location.href,
      );
      const { error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: redirectTo,
          data: {
            name: formData.name,
            surname: formData.surname,
          },
        },
      });

      if (signupError) throw signupError;

      // ✅ Créer le profil après l'inscription réussie
      const profileResult = await createUserProfile({
        email: formData.email,
        name: formData.name,
        surname: formData.surname,
      });

      if (!profileResult.success) {
        console.warn("[Signup] Profile creation failed:", profileResult.error);
        // Ne pas bloquer le flux, afficher un message d'avertissement seulement en console
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Impossible de créer le compte.";
      setError(translateAuthError(message));
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
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
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
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
                  Nouveau membre
                </p>
                <h1
                  className={`mt-5 text-4xl font-semibold tracking-[0.08em] text-slate-900 ${instrumentSerif.className}`}
                >
                  AM.E.S.C.A.O
                </h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-600">
                  Créez votre compte en quelques secondes avec une interface
                  sobre, moderne et pensée pour tous les écrans.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/80 bg-slate-950/5 p-4 text-sm text-slate-600">
                Le compte vous permet d’accéder à toutes les fonctionnalités
                proposées par l’espace AM.E.S.C.A.O.
              </div>
            </div>
          )}

          <div className="w-full max-w-[460px] justify-self-center rounded-[32px] border border-slate-200/80 bg-white/70 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-8 lg:max-w-none">
            <div className="mb-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                Inscription
              </p>
              <h2
                className={`mt-3 text-3xl font-semibold tracking-[0.08em] text-slate-900 ${instrumentSerif.className}`}
              >
                AM.E.S.C.A.O
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Créez votre compte pour continuer.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                aria-live="assertive"
                className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
              >
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleLoading}
              aria-busy={googleLoading}
              aria-disabled={googleLoading}
              className="mb-6 flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {googleLoading ? (
                <DotLoader />
              ) : (
                <>
                  <GoogleLogo /> Continuer avec Google
                </>
              )}
            </button>

            <div className="mb-7 flex items-center gap-4 text-[11px] uppercase tracking-[0.35em] text-slate-400">
              <div className="h-px flex-1 bg-slate-200" />
              <span>ou</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500"
                >
                  Prénom
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  aria-label="Prénom"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Prénom"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="surname"
                  className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500"
                >
                  Nom
                </label>
                <input
                  id="surname"
                  name="surname"
                  type="text"
                  value={formData.surname}
                  onChange={handleChange}
                  aria-label="Nom"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="Nom"
                  required
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-500"
                >
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-label="Adresse e-mail"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="votre@email.com"
                  autoComplete="email"
                  required
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
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  aria-label="Mot de passe"
                  className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                aria-disabled={loading}
                className="flex w-full items-center justify-center rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <DotLoader variant="current" className="text-white" />
                ) : (
                  "Créer mon compte"
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-slate-600">
              Déjà membre ?
              <Link
                href="/login"
                className="ml-2 font-semibold text-slate-900 transition hover:text-slate-700"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
