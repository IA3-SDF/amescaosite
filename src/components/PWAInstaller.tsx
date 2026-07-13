"use client";

import { Download, Share, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeContext";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const PWAInstaller: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  type AppleNavigator = Navigator & { standalone?: boolean };
  const [isIOS] = useState<boolean>(() => {
    if (typeof navigator === "undefined") return false;
    const nav = navigator as AppleNavigator;
    return /iPad|iPhone|iPod/.test(nav.userAgent);
  });
  const [isStandalone] = useState<boolean>(() => {
    if (typeof navigator === "undefined" || typeof window === "undefined")
      return false;

    const nav = navigator as AppleNavigator;
    return (
      ("standalone" in nav && nav.standalone === true) ||
      window.matchMedia("(display-mode: standalone)").matches
    );
  });

  useEffect(() => {
    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const nav = navigator as AppleNavigator;
    const isInStandaloneMode =
      ("standalone" in nav && nav.standalone === true) ||
      window.matchMedia("(display-mode: standalone)").matches;

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          console.log("[PWA] Service Worker enregistré:", registration);
        })
        .catch((error) => {
          console.error("[PWA] Erreur enregistrement SW:", error);
        });
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const event = e as BeforeInstallPromptEvent;
      setDeferredPrompt(event);
      setTimeout(() => setShowPrompt(true), 2000);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    if (isAppleDevice && !isInStandaloneMode) {
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setShowPrompt(false);
      setDeferredPrompt(null);
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
    }
  };

  if (isStandalone || isInstalled || !showPrompt) {
    return null;
  }

  const baseContainerClass =
    "browser-only-menu fixed inset-x-2 bottom-3 z-50 mx-auto max-w-[min(580px,calc(100vw-1rem))] lg:hidden";
  const positionClass = isIOS ? "sm:bottom-8" : "sm:bottom-6";
  const finalContainerClass = `${baseContainerClass} ${positionClass}`;

  const glassBgClass = isDark
    ? "bg-slate-900/60 border-slate-700/50 shadow-slate-950/70"
    : "bg-white/70 border-slate-100 shadow-slate-100";

  return (
    <div className={finalContainerClass}>
      <div
        className={`relative overflow-hidden rounded-[2rem] p-5 sm:p-6 max-h-[86vh] shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 backdrop-blur-2xl border ${glassBgClass}`}
      >
        <button
          onClick={() => setShowPrompt(false)}
          className={`absolute right-4 top-4 rounded-full p-2.5 transition-all duration-150 ${
            isDark
              ? "text-slate-400 hover:bg-slate-700/70 hover:text-white"
              : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          }`}
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 max-h-[76vh] overflow-y-auto pr-1">
          <div
            className={`flex h-16 sm:h-20 w-16 sm:w-20 shrink-0 items-center justify-center rounded-3xl text-white shadow-xl ${
              isDark
                ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30"
                : "bg-slate-900 shadow-slate-900/20"
            }`}
          >
            {isIOS ? (
              <Share className="h-10 md:h-8 w-10 md:w-8 animate-bounce [animation-duration:3s]" />
            ) : (
              <Download className="h-10 md:h-8 w-10 md:w-8 animate-bounce [animation-duration:3s]" />
            )}
          </div>

          <div className="flex-1 text-center sm:text-left pr-0 sm:pr-4">
            <h3
              className={`font-extrabold text-xl sm:text-2xl tracking-tighter ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              AM.E.S.C.A.O
            </h3>
            <p
              className={`mt-2 sm:mt-1.5 text-sm sm:text-base leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              Plein écran, performance foudroyante et accès instantané.
              Installez AM.E.S.C.A.O en un clic sur votre appareil.
            </p>

            {isIOS ? (
              <div
                className={`mt-6 md:mt-5 space-y-3 md:space-y-2.5 rounded-2xl p-4 md:p-3 border ${
                  isDark
                    ? "bg-slate-800/60 border-slate-700/50 text-slate-200"
                    : "bg-slate-50 border-slate-100 text-slate-700"
                }`}
              >
                <div className="flex items-center gap-3 md:gap-2.5 text-base md:text-sm font-semibold">
                  <span
                    className={`flex h-7 md:h-6 w-7 md:w-6 items-center justify-center rounded-full text-xs md:text-[11px] font-extrabold ${
                      isDark
                        ? "bg-indigo-500/30 text-indigo-200"
                        : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    1
                  </span>
                  <span>
                    Appuyez sur{" "}
                    <Share className="inline h-5 md:h-4 w-5 md:w-4 mx-1 text-blue-500 align-text-bottom" />
                  </span>
                </div>
                <div className="flex items-center gap-3 md:gap-2.5 text-base md:text-sm font-semibold">
                  <span
                    className={`flex h-7 md:h-6 w-7 md:w-6 items-center justify-center rounded-full text-xs md:text-[11px] font-extrabold ${
                      isDark
                        ? "bg-indigo-500/30 text-indigo-200"
                        : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    2
                  </span>
                  <span>
                    Choisissez&nbsp;
                    <span
                      className={`font-extrabold ${isDark ? "text-white" : "text-slate-950"}`}
                    >
                      Sur l&apos;écran d&apos;accueil
                    </span>
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleInstall}
                  className={`w-full sm:w-auto flex-1 px-6 py-3.5 text-base sm:text-sm font-extrabold rounded-2xl transition-all duration-150 active:scale-[0.97] ${
                    isDark
                      ? "bg-white text-slate-950 hover:bg-slate-100 shadow-white/10 shadow-lg"
                      : "bg-slate-950 text-white hover:bg-slate-800 shadow-slate-950/10 shadow-lg"
                  }`}
                >
                  Installer AM.E.S.C.A.O
                </button>
                <button
                  onClick={() => setShowPrompt(false)}
                  className={`w-full sm:w-auto px-6 py-3.5 text-base sm:text-sm font-semibold rounded-2xl transition-colors ${
                    isDark
                      ? "bg-slate-800/60 hover:bg-slate-800 text-slate-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  Plus tard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
