/**
 * Utilitaires pour la gestion des cookies et du consentement RGPD
 */
import Cookies from "js-cookie";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export interface ConsentData {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const CONSENT_COOKIE_NAME = "user_consent";
const CONSENT_EXPIRES_DAYS = 365;

/**
 * Récupérer le consentement depuis le cookie local
 */
export const getLocalConsent = (): ConsentData | null => {
  const stored = Cookies.get(CONSENT_COOKIE_NAME);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as ConsentData;
  } catch {
    return null;
  }
};

/**
 * Sauvegarder le consentement dans le cookie local
 */
export const setLocalConsent = (consent: ConsentData): void => {
  Cookies.set(CONSENT_COOKIE_NAME, JSON.stringify(consent), {
    expires: CONSENT_EXPIRES_DAYS,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
  });
};

/**
 * Vérifier si l'utilisateur a donné son consentement
 */
export const hasUserConsented = (): boolean => {
  return getLocalConsent() !== null;
};

/**
 * Charger les scripts analytiques si consentement accordé
 * Guard against duplicate script injection
 */
export const initAnalytics = (): void => {
  const consent = getLocalConsent();

  if (consent?.analytics) {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_GA_ID) {
      // Check if script already exists
      const existingScript = document.querySelector(
        `script[src="https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}"]`,
      );
      if (existingScript) return; // Already initialized

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      // Only define gtag if not already defined
      if (!window.gtag) {
        const gtag = (...args: unknown[]) => {
          window.dataLayer?.push(args);
        };
        window.gtag = gtag;
      }
      window.gtag?.("js", new Date());
      window.gtag?.("config", process.env.NEXT_PUBLIC_GA_ID);
    }
  }
};

/**
 * Charger les scripts de marketing si consentement accordé
 * Guard against duplicate pixel injection
 */
export const initMarketing = (): void => {
  const consent = getLocalConsent();

  if (consent?.marketing) {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FB_PIXEL_ID) {
      // Check if fbq is already defined (pixel already initialized)
      if (window.fbq) return; // Already initialized

      const script = document.createElement("script");
      script.innerHTML = `
        !function(f,b,e,v,n,t,s){
          if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)
        }(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_FB_PIXEL_ID}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }
  }
};

/**
 * Réinitialiser le consentement (optionnel)
 */
export const resetConsent = (): void => {
  Cookies.remove(CONSENT_COOKIE_NAME);
};

const consentUtils = {
  getLocalConsent,
  setLocalConsent,
  hasUserConsented,
  initAnalytics,
  initMarketing,
  resetConsent,
};

export default consentUtils;
