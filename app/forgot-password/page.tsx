"use client";

import { DM_Sans, Instrument_Serif } from "next/font/google";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { getAuthRedirectUrl } from "../../src/lib/auth";
import { supabase } from "../../src/services/supabase/client";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const redirectTo = getAuthRedirectUrl(
        "/auth/callback?next=/reset-password",
        window.location.href,
      );
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) throw error;
      setSent(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Veuillez réessayer.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] px-4 py-6 sm:px-6 lg:px-8 ${dmSans.className}`}
    >
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center">
        <div className="w-full max-w-[430px] rounded-[32px] border border-slate-200/80 bg-white/70 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              Mot de passe oublié
            </p>
            <h2
              className={`mt-3 text-3xl font-semibold tracking-[0.08em] text-slate-900 ${instrumentSerif.className}`}
            >
              AM.E.S.C.A.O
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Saisissez votre adresse e-mail pour recevoir un lien de
              réinitialisation.
            </p>
          </div>

          {sent ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-sm text-emerald-700">
              <p className="font-semibold">Email envoyé</p>
              <p className="mt-2 text-emerald-600">
                Vérifiez votre boîte de réception à <strong>{email}</strong>{" "}
                pour poursuivre la procédure.
              </p>
            </div>
          ) : (
            <>
              {error ? (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
                >
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "En cours..." : "Envoyer le lien"}
                </button>
              </form>
            </>
          )}

          <div className="mt-8 text-center text-sm text-slate-600">
            Vous vous souvenez ?
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
  );
}
