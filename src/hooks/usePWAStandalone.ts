"use client";

import { useSyncExternalStore } from "react";

/**
 * Hook pour détecter si l'application est en mode PWA Standalone (installée)
 * Compatible avec iOS, Android et Web
 */
export const usePWAStandalone = (): boolean => {
  type StandaloneNavigator = Navigator & { standalone?: boolean };

  const getStandaloneState = (): boolean => {
    if (typeof window === "undefined") return false;

    const nav = navigator as StandaloneNavigator;
    const isIOS = nav.standalone === true;
    const isAndroidOrWeb =
      window.matchMedia("(display-mode: standalone)").matches ||
      document.referrer.includes("android-app://");

    return isIOS || isAndroidOrWeb;
  };

  const subscribe = (callback: () => void) => {
    if (typeof window === "undefined") return () => undefined;

    const mediaQueryList = window.matchMedia("(display-mode: standalone)");
    mediaQueryList.addEventListener("change", callback);

    return () => {
      mediaQueryList.removeEventListener("change", callback);
    };
  };

  return useSyncExternalStore(subscribe, getStandaloneState, () => false);
};
