"use client";

import { saveUserConsent } from "@/src/actions/consent";
import { supabase } from "@/src/services/supabase/client";
import { AnimatePresence, motion, Variants } from "framer-motion";
import Cookies from "js-cookie";
import {
  BarChart3,
  Check,
  Cookie,
  Shield,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

interface ConsentState {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const DEFAULT_CONSENT: ConsentState = {
  analytics: false,
  marketing: false,
  preferences: true,
};

export default function CookieBanner() {
  // 1. Hooks d'états et contextes
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isDark = theme === "dark";

  // 2. Cycle de vie (Effets)
  useEffect(() => {
    const checkConsent = () => {
      const savedConsent = Cookies.get("user_consent");
      if (!savedConsent) {
        setIsVisible(true);
      } else {
        setIsSaved(true);
      }
    };

    const timer = setTimeout(checkConsent, 500);
    return () => clearTimeout(timer);
  }, []);

  // 3. Logique métier et handlers
  const saveConsent = async (consentData: ConsentState) => {
    setIsLoading(true);

    try {
      Cookies.set("user_consent", JSON.stringify(consentData), {
        expires: 365,
        sameSite: "Lax",
        secure: process.env.NODE_ENV === "production",
      });

      const { data: sessionData } = await supabase.auth.getSession();
      const isAuthenticated = Boolean(sessionData?.session?.user);

      if (isAuthenticated) {
        const result = await saveUserConsent(consentData);

        if (
          !result.success &&
          "authenticated" in result &&
          result.authenticated
        ) {
          console.warn("[Consent] Failed to save to database:", result.error);
        } else if (result.success) {
          console.log("[Consent] ✅ Saved successfully", {
            local: true,
            server: "authenticated" in result ? result.authenticated : false,
          });
        }
      } else {
        console.log(
          "[Consent] No authenticated user, consent saved locally only.",
        );
      }

      setIsSaved(true);
      setIsExpanded(false);
      window.dispatchEvent(
        new CustomEvent("consentChanged", { detail: consentData }),
      );

      setTimeout(() => {
        setIsVisible(false);
      }, 1800);
    } catch (err) {
      console.error("[Consent] Error saving consent:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAll = async () => {
    const allConsent: ConsentState = {
      analytics: true,
      marketing: true,
      preferences: true,
    };
    await saveConsent(allConsent);
  };

  const handleRejectAll = async () => {
    const minimalConsent: ConsentState = {
      analytics: false,
      marketing: false,
      preferences: true,
    };
    await saveConsent(minimalConsent);
  };

  const handleSavePreferences = async () => {
    await saveConsent(consent);
  };

  const toggleConsent = (key: keyof ConsentState) => {
    if (key === "preferences") return;
    setConsent((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // 4. Variantes d'animation
  const bannerVariants: Variants = {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 260, damping: 24 },
    },
    exit: { y: 100, opacity: 0, transition: { duration: 0.2 } },
  };

  const successVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 320, damping: 24 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && !isSaved && (
        <motion.div
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed inset-x-2 bottom-2 z-50 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-[560px] rounded-[28px] border border-white/15 p-3 shadow-[0_30px_90px_-24px_rgba(15,23,42,0.45)] backdrop-blur-[28px] sm:p-4 max-h-[88vh] overflow-hidden ${
            isDark ? "bg-slate-950/60" : "bg-white/70"
          }`}
        >
          {/* Version rétractée (Bannière principale) */}
          {!isExpanded && (
            <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-white/10 dark:bg-slate-900/30 p-4 backdrop-blur-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-300/80 via-sky-300/60 to-fuchsia-300/80 blur-xl" />

              <div className="flex flex-col gap-4 relative">
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-emerald-500/15 text-emerald-400"
                        : "bg-emerald-500/10 text-emerald-600"
                    }`}
                  >
                    <Cookie size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        Respect de votre vie privée
                      </p>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                          isDark
                            ? "bg-white/10 text-slate-300"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        RGPD
                      </span>
                    </div>
                    <p
                      className={`text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Nous utilisons des cookies pour améliorer votre
                      expérience, personnaliser le contenu et analyser notre
                      trafic.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <button
                    onClick={handleRejectAll}
                    disabled={isLoading}
                    className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                      isDark
                        ? "bg-white/10 text-slate-200 hover:bg-white/15"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    } disabled:opacity-50`}
                  >
                    Refuser
                  </button>
                  <button
                    onClick={() => setIsExpanded(true)}
                    className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                      isDark
                        ? "bg-white/10 text-slate-200 hover:bg-white/15"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Personnaliser
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    disabled={isLoading}
                    className="rounded-full bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {isLoading ? "Traitement..." : "Accepter tout"}
                  </button>
                </div>

                <div
                  className={`flex flex-wrap items-center gap-3 border-t pt-3 text-sm ${
                    isDark
                      ? "border-white/10 text-slate-400"
                      : "border-slate-200 text-slate-600"
                  }`}
                >
                  <Link
                    href="/privacy-policy"
                    className="font-medium transition hover:text-emerald-500"
                  >
                    Politique de confidentialité
                  </Link>
                  <span className="opacity-60">•</span>
                  <Link
                    href="/terms"
                    className="font-medium transition hover:text-emerald-500"
                  >
                    Conditions générales
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Version étendue (Panneau de personnalisation) */}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-5 max-h-[70vh] overflow-y-auto pr-1"
            >
              <div className="flex items-start justify-between gap-4 rounded-[24px] border border-white/10 bg-white/10 dark:bg-slate-900/30 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
                      isDark
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-emerald-500/15 text-emerald-600"
                    }`}
                  >
                    <Shield size={18} />
                  </div>
                  <div>
                    <h2
                      className={`text-lg font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      Gestion de vos choix
                    </h2>
                    <p
                      className={`text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
                    >
                      Nous respectons votre vie privée et vous gardons le
                      contrôle.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className={`rounded-full p-2 transition ${
                    isDark
                      ? "text-slate-400 hover:bg-white/10 hover:text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {/* Essentiels */}
                <div
                  className={`rounded-2xl border p-4 ${
                    isDark
                      ? "border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Shield
                      className={`h-4 w-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                    />
                    <h3
                      className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                    >
                      Essentiels
                    </h3>
                  </div>
                  <p
                    className={`text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    Nécessaires au bon fonctionnement du site et à la sécurité.
                  </p>
                </div>

                {/* Analytique */}
                <button
                  type="button"
                  onClick={() => toggleConsent("analytics")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isDark
                      ? "border-white/10 bg-white/5 hover:bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3
                        className={`h-4 w-4 ${
                          consent.analytics
                            ? isDark
                              ? "text-sky-400"
                              : "text-sky-600"
                            : isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                        }`}
                      />
                      <h3
                        className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        Analytique
                      </h3>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        consent.analytics
                          ? isDark
                            ? "border-sky-400 bg-sky-500"
                            : "border-sky-500 bg-sky-500"
                          : isDark
                            ? "border-white/10"
                            : "border-slate-300"
                      }`}
                    >
                      {consent.analytics && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    Aide à améliorer la qualité du service et l’expérience
                    globale.
                  </p>
                </button>

                {/* Marketing */}
                <button
                  type="button"
                  onClick={() => toggleConsent("marketing")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isDark
                      ? "border-white/10 bg-white/5 hover:bg-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                      : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target
                        className={`h-4 w-4 ${
                          consent.marketing
                            ? isDark
                              ? "text-fuchsia-400"
                              : "text-fuchsia-600"
                            : isDark
                              ? "text-slate-500"
                              : "text-slate-400"
                        }`}
                      />
                      <h3
                        className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                      >
                        Marketing
                      </h3>
                    </div>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                        consent.marketing
                          ? isDark
                            ? "border-fuchsia-400 bg-fuchsia-500"
                            : "border-fuchsia-500 bg-fuchsia-500"
                          : isDark
                            ? "border-white/10"
                            : "border-slate-300"
                      }`}
                    >
                      {consent.marketing && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                  >
                    Permet de personnaliser certains contenus et offres à votre
                    profil.
                  </p>
                </button>
              </div>

              {/* Rappel des droits */}
              <div
                className={`rounded-2xl border p-4 ${
                  isDark
                    ? "border-white/10 bg-white/5 shadow-[0_0_0_1px_rgba(255,255,255,0.05)]"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles
                    className={`h-4 w-4 ${isDark ? "text-amber-400" : "text-amber-600"}`}
                  />
                  <p
                    className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}
                  >
                    Vos choix restent sous votre contrôle
                  </p>
                </div>
                <p
                  className={`text-sm leading-6 ${isDark ? "text-slate-400" : "text-slate-600"}`}
                >
                  Vous pouvez ajuster vos préférences à tout moment. Consultez
                  aussi nos{" "}
                  <Link
                    href="/privacy-policy"
                    className="font-semibold text-emerald-500 transition hover:text-emerald-400"
                  >
                    politiques de confidentialité
                  </Link>{" "}
                  et{" "}
                  <Link
                    href="/terms"
                    className="font-semibold text-emerald-500 transition hover:text-emerald-400"
                  >
                    conditions générales
                  </Link>
                  .
                </p>
              </div>

              {/* Actions du volet étendu */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={() => setIsExpanded(false)}
                  disabled={isLoading}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    isDark
                      ? "bg-white/10 text-slate-200 hover:bg-white/15"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Fermer
                </button>
                <button
                  onClick={handleRejectAll}
                  disabled={isLoading}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    isDark
                      ? "bg-white/10 text-slate-200 hover:bg-white/15"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  Refuser tous
                </button>
                <button
                  onClick={handleSavePreferences}
                  disabled={isLoading}
                  className="rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-500 disabled:opacity-50"
                >
                  {isLoading ? "Enregistrement..." : "Enregistrer mes choix"}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Notification de succès */}
      {isSaved && isVisible && (
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`fixed inset-x-2 bottom-2 z-50 max-w-sm rounded-[24px] border px-4 py-3 shadow-[0_20px_70px_-20px_rgba(15,23,42,0.3)] sm:bottom-4 sm:right-4 sm:left-auto ${
            isDark
              ? "border-white/10 bg-slate-950/90 text-white"
              : "border-slate-200 bg-white text-slate-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-emerald-500/15 p-2 text-emerald-500">
              <Check size={16} />
            </div>
            <span className="text-sm font-semibold">
              Vos préférences ont été enregistrées
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
