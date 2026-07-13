// src/config/ios-pwa.config.ts
/**
 * Configuration PWA pour iOS
 * Gère les comportements spécifiques à Apple/iOS
 */

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

export const iosPWAConfig = {
  // Détection de l'appareil
  isIOS: () => {
    if (typeof navigator === "undefined") return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // Détection du mode standalone
  isStandalone: () => {
    if (typeof window === "undefined") return false;
    return (
      ("standalone" in navigator &&
        (navigator as NavigatorWithStandalone).standalone === true) ||
      window.matchMedia("(display-mode: standalone)").matches
    );
  },

  // Détection de la version iOS
  getIOSVersion: (): number | null => {
    if (typeof navigator === "undefined") return null;
    const match = navigator.userAgent.match(/Version\/(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  },

  // Couleurs pour iOS selon le mode standalone
  getStatusBarColor: (): "default" | "black" | "black-translucent" => {
    if (typeof window === "undefined") return "default";
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return isDark ? "black-translucent" : "default";
  },

  // Configuration pour les interactions tactiles
  setupTouchOptimizations: () => {
    if (typeof window === "undefined") return;

    // Désactiver le bounce iOS
    document.addEventListener(
      "touchmove",
      (e) => {
        if ((e.target as HTMLElement).closest("body")) {
          // Permettre le scroll dans les éléments scrollables
          const scrollable = (e.target as HTMLElement).closest(
            "[data-scrollable], body",
          );
          if (!scrollable) {
            e.preventDefault();
          }
        }
      },
      { passive: false },
    );

    // Empêcher le double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener(
      "touchend",
      (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
          event.preventDefault();
        }
        lastTouchEnd = now;
      },
      false,
    );
  },

  // Configuration pour les entrées utilisateur
  setupInputOptimizations: () => {
    if (typeof window === "undefined") return;

    // Désactiver le zoom de l'entrée sur iOS
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no",
      );
    }

    // Désactiver le long-press menu sur iOS
    document.addEventListener("contextmenu", (e) => {
      const allowContextMenu =
        (e.target as HTMLElement).tagName === "A" ||
        (e.target as HTMLElement).tagName === "INPUT";

      if (!allowContextMenu) {
        e.preventDefault();
      }
    });
  },

  // Détection de l'écran notch
  getSafeAreas: () => {
    if (typeof window === "undefined") {
      return {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      };
    }

    const style = getComputedStyle(document.documentElement);
    return {
      top: parseInt(style.getPropertyValue("safe-area-inset-top")) || 0,
      right: parseInt(style.getPropertyValue("safe-area-inset-right")) || 0,
      bottom: parseInt(style.getPropertyValue("safe-area-inset-bottom")) || 0,
      left: parseInt(style.getPropertyValue("safe-area-inset-left")) || 0,
    };
  },

  // Gestion du clavier iOS
  setupKeyboardHandling: () => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", () => {
      // Permet au contenu de ne pas être caché par le clavier iOS
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute(
          "content",
          "width=device-width, initial-scale=1, viewport-fit=cover",
        );
      }
    });
  },

  // Activation de toutes les optimisations
  initialize: () => {
    if (typeof window === "undefined") return;

    const isIos = iosPWAConfig.isIOS();
    if (!isIos) return;

    iosPWAConfig.setupTouchOptimizations();
    iosPWAConfig.setupInputOptimizations();
    iosPWAConfig.setupKeyboardHandling();

    console.log("[PWA iOS] Optimisations initialisées", {
      version: iosPWAConfig.getIOSVersion(),
      standalone: iosPWAConfig.isStandalone(),
      safeAreas: iosPWAConfig.getSafeAreas(),
    });
  },
};
