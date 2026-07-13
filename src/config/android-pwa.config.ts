// src/config/android-pwa.config.ts
/**
 * Configuration PWA pour Android
 * Gère les comportements spécifiques à Android
 */

type NavigatorWithStandalone = Navigator & { standalone?: boolean };

export const androidPWAConfig = {
  // Détection de l'appareil Android
  isAndroid: () => {
    if (typeof navigator === "undefined") return false;
    return /Android/.test(navigator.userAgent);
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

  // Détection de la version Android
  getAndroidVersion: (): number | null => {
    if (typeof navigator === "undefined") return null;
    const match = navigator.userAgent.match(/Android\s([0-9.]*)/);
    return match ? parseFloat(match[1]) : null;
  },

  // Obtenir le navigateur Android
  getAndroidBrowser: (): "chrome" | "firefox" | "samsung" | "other" => {
    if (typeof navigator === "undefined") return "other";
    const ua = navigator.userAgent;
    if (/Chrome/.test(ua) && !/Edge/.test(ua)) return "chrome";
    if (/Firefox/.test(ua)) return "firefox";
    if (/SamsungBrowser/.test(ua)) return "samsung";
    return "other";
  },

  // Configuration pour les interactions tactiles Android
  setupTouchOptimizations: () => {
    if (typeof window === "undefined") return;

    // Gérer le bouton retour Android
    let backPressCount = 0;
    const backPressTimeout = 2000;

    document.addEventListener("keydown", (event) => {
      if (event.key === "Backspace" || event.key === "Escape") {
        backPressCount++;

        if (backPressCount === 1) {
          // Premier appui: afficher un message ou revenir
          if (window.history.length > 1) {
            window.history.back();
          } else {
            // Si c'est la première page, on peut minimiser l'app
            console.log("[PWA Android] Première page - vous pouvez minimiser");
          }

          setTimeout(() => {
            backPressCount = 0;
          }, backPressTimeout);
        } else if (backPressCount === 2) {
          // Double appui: quitter l'app (si en standalone)
          if (androidPWAConfig.isStandalone()) {
            // On ne peut pas vraiment quitter d'une PWA, mais on peut log
            console.log("[PWA Android] Double appui détecté");
          }
        }
      }
    });

    // Supporter le Web Share API (Android)
    if (typeof navigator.share === "function") {
      console.log("[PWA Android] Web Share API disponible");
    }

    // Désactiver le zoom sur Android
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
      );
    }

    // Optimiser les interactions de tap
    document.addEventListener(
      "touchstart",
      (e) => {
        // Active l'effet tactile via CSS si disponible
        const target = e.target as HTMLElement;
        if (target && target.onclick) {
          target.style.opacity = "0.8";
        }
      },
      false,
    );

    document.addEventListener(
      "touchend",
      (e) => {
        const target = e.target as HTMLElement;
        if (target) {
          target.style.opacity = "1";
        }
      },
      false,
    );
  },

  // Configuration pour le clavier Android
  setupKeyboardHandling: () => {
    if (typeof window === "undefined") return;

    const initialHeight = window.innerHeight;

    window.addEventListener("resize", () => {
      const currentHeight = window.innerHeight;

      // Si le clavier est ouvert (hauteur réduite)
      if (currentHeight < initialHeight * 0.75) {
        console.log("[PWA Android] Clavier visible");
        // Vous pouvez ajuster l'UI ici si nécessaire
      } else {
        console.log("[PWA Android] Clavier caché");
      }
    });
  },

  // Support de Web Share API
  setupWebShare: () => {
    if (typeof navigator === "undefined" || !navigator.share) return;

    console.log("[PWA Android] Web Share API configuré");

    // Exemple d'utilisation:
    // await navigator.share({
    //   title: 'AMESCAO',
    //   text: 'Découvrez AMESCAO',
    //   url: window.location.href
    // });
  },

  // Gestion des notifications Push Android
  setupNotifications: () => {
    if (typeof Notification === "undefined") return;

    if (Notification.permission === "granted") {
      console.log("[PWA Android] Permission notifications accordée");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          console.log("[PWA Android] Permission notifications accordée");
        }
      });
    }
  },

  // Activation de toutes les optimisations Android
  initialize: () => {
    if (typeof window === "undefined") return;

    const isAndroid = androidPWAConfig.isAndroid();
    if (!isAndroid) return;

    androidPWAConfig.setupTouchOptimizations();
    androidPWAConfig.setupKeyboardHandling();
    androidPWAConfig.setupWebShare();
    androidPWAConfig.setupNotifications();

    console.log("[PWA Android] Optimisations initialisées", {
      version: androidPWAConfig.getAndroidVersion(),
      browser: androidPWAConfig.getAndroidBrowser(),
      standalone: androidPWAConfig.isStandalone(),
    });
  },
};
