"use client";

import { androidPWAConfig } from "@/src/config/android-pwa.config";
import { iosPWAConfig } from "@/src/config/ios-pwa.config";
import { useEffect } from "react";

/**
 * Composant pour améliorer la prise en charge PWA
 * - iOS: Désactive les bounces, configure les interactions tactiles
 * - Android: Gère le back button, Web Share, notifications
 * - Les deux: Optimise le clavier et les entrées utilisateur
 */
export const IOSPWAOptimizer: React.FC = () => {
  useEffect(() => {
    // Initialiser optimisations iOS
    if (iosPWAConfig.isIOS()) {
      iosPWAConfig.initialize();
      console.log(
        "[PWA] iOS détecté - Mode standalone:",
        iosPWAConfig.isStandalone(),
      );
    }

    // Initialiser optimisations Android
    if (androidPWAConfig.isAndroid()) {
      androidPWAConfig.initialize();
      console.log(
        "[PWA] Android détecté - Mode standalone:",
        androidPWAConfig.isStandalone(),
      );
    }

    // Pour les autres appareils
    if (!iosPWAConfig.isIOS() && !androidPWAConfig.isAndroid()) {
      console.log("[PWA] Appareil de bureau détecté");
    }
  }, []);

  return null;
};
