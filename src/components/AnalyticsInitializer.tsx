"use client";

import { useEffect, useRef } from "react";
import {
  initAnalytics,
  initMarketing,
  getLocalConsent,
} from "@/src/utils/consentUtils";

/**
 * AnalyticsInitializer
 * Composant qui initialise les scripts analytiques/marketing en fonction du consentement
 * À intégrer dans les Providers
 */
export default function AnalyticsInitializer() {
  const analyticsInitialized = useRef(false);
  const marketingInitialized = useRef(false);

  useEffect(() => {
    // Vérifier le consentement au montage
    const consent = getLocalConsent();

    if (consent?.analytics && !analyticsInitialized.current) {
      console.log("[Analytics] ✅ Initializing analytics...");
      initAnalytics();
      analyticsInitialized.current = true;
    }

    if (consent?.marketing && !marketingInitialized.current) {
      console.log("[Marketing] ✅ Initializing marketing...");
      initMarketing();
      marketingInitialized.current = true;
    }

    // Écouter les changements de consentement (cross-tab changes)
    const handleConsentChange = () => {
      const updatedConsent = getLocalConsent();
      console.log("[Consent] Updated:", updatedConsent);

      // Vous pouvez ici réinitialiser les scripts si le consentement change
      if (updatedConsent?.analytics && !analyticsInitialized.current) {
        initAnalytics();
        analyticsInitialized.current = true;
      }
      if (updatedConsent?.marketing && !marketingInitialized.current) {
        initMarketing();
        marketingInitialized.current = true;
      }
    };

    // Handle custom event for same-tab consent changes
    const handleCustomConsentChange = (event: CustomEvent) => {
      console.log("[Consent] Custom event triggered:", event.detail);
      const updatedConsent = getLocalConsent();

      if (updatedConsent?.analytics && !analyticsInitialized.current) {
        initAnalytics();
        analyticsInitialized.current = true;
      }
      if (updatedConsent?.marketing && !marketingInitialized.current) {
        initMarketing();
        marketingInitialized.current = true;
      }
    };

    window.addEventListener("storage", handleConsentChange);
    window.addEventListener(
      "consentChanged",
      handleCustomConsentChange as EventListener,
    );

    return () => {
      window.removeEventListener("storage", handleConsentChange);
      window.removeEventListener(
        "consentChanged",
        handleCustomConsentChange as EventListener,
      );
    };
  }, []);

  return null;
}
