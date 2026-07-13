"use client";

import {
  ConsentData,
  getLocalConsent,
  hasUserConsented,
} from "@/src/utils/consentUtils";
import { useEffect, useState } from "react";

/**
 * Hook personnalisé pour accéder au consentement de l'utilisateur
 *
 * @example
 * const { consent, hasConsented, canAnalytics, canMarketing } = useConsent();
 */
export function useConsent() {
  const [consent, setConsent] = useState<ConsentData | null>(() =>
    getLocalConsent(),
  );
  const [hasConsented, setHasConsented] = useState(() => hasUserConsented());
  const [isLoading] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = getLocalConsent();
      setConsent(updated);
      setHasConsented(hasUserConsented());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "consentChanged",
      handleStorageChange as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "consentChanged",
        handleStorageChange as EventListener,
      );
    };
  }, []);

  return {
    // État brut
    consent,
    hasConsented,
    isLoading,

    // Raccourcis pratiques
    canAnalytics: consent?.analytics ?? false,
    canMarketing: consent?.marketing ?? false,
    canPreferences: consent?.preferences ?? true,
  };
}
