"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Calendar, HandHeart, Home, Images, Mail } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";

export type MobileTab = "home" | "events" | "albums" | "contact" | "support";

interface TabConfig {
  id: MobileTab;
  label: string;
  icon: typeof Home;
  path: string;
}

const TABS: TabConfig[] = [
  { id: "home", label: "Accueil", icon: Home, path: "/home" },
  { id: "events", label: "Evenements", icon: Calendar, path: "/events" },
  { id: "albums", label: "Album", icon: Images, path: "/albums" },
  { id: "contact", label: "Contact", icon: Mail, path: "/contact" },
  { id: "support", label: "Soutenir", icon: HandHeart, path: "/support" },
];

// Distance CUMULÉE (px) à parcourir dans un sens avant de réagir.
// Contrairement à un delta instantané, ce cumul absorbe le bruit du
// bounce iOS et la résistance de scroll Android : un simple tremblement
// ou un micro-scroll accidentel ne fait plus "clignoter" la barre.
const HIDE_ACCUM_THRESHOLD = 46; // vers le bas : on masque
const REVEAL_ACCUM_THRESHOLD = 18; // vers le haut : on réaffiche (plus sensible, par confort)
// Zone proche du haut de page où la barre reste toujours visible
const TOP_ZONE_THRESHOLD = 32;
// Délai d'inactivité (ms) après lequel la barre se masque si l'utilisateur
// s'est arrêté (ex: lecture d'un contenu, CTA en bas de page qu'on ne veut
// pas recouvrir). Volontairement posé, pas pressé.
const IDLE_HIDE_DELAY = 2400;

export const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(true);

  const lastScrollY = useRef(0);
  const scrollAccum = useRef(0);
  const scrollDirection = useRef<"up" | "down" | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isTicking = useRef(false);

  useEffect(() => {
    lastScrollY.current = window.scrollY;
  }, []);

  const scheduleIdleHide = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      // On ne masque jamais quand on est tout en haut de la page
      if (window.scrollY > TOP_ZONE_THRESHOLD) {
        setIsVisible(false);
      }
    }, IDLE_HIDE_DELAY);
  }, []);

  // Auto-hide calme : la barre ne réagit qu'après une intention de scroll
  // clairement établie (cumul de distance), pas à chaque pixel.
  useEffect(() => {
    const handleScroll = () => {
      if (isTicking.current) return;
      isTicking.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta = currentY - lastScrollY.current;

        if (currentY <= TOP_ZONE_THRESHOLD) {
          setIsVisible(true);
          scrollAccum.current = 0;
          scrollDirection.current = null;
        } else if (delta !== 0) {
          const direction = delta > 0 ? "down" : "up";

          // Changement de sens : on repart d'un cumul propre, pour éviter
          // qu'un mouvement précédent ne "pollue" la décision actuelle.
          if (direction !== scrollDirection.current) {
            scrollAccum.current = 0;
            scrollDirection.current = direction;
          }

          scrollAccum.current += Math.abs(delta);

          if (
            direction === "down" &&
            scrollAccum.current > HIDE_ACCUM_THRESHOLD
          ) {
            setIsVisible(false);
          } else if (
            direction === "up" &&
            scrollAccum.current > REVEAL_ACCUM_THRESHOLD
          ) {
            setIsVisible(true);
          }
        }

        lastScrollY.current = currentY;
        scheduleIdleHide();
        isTicking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    scheduleIdleHide();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [scheduleIdleHide]);

  const getActiveTab = (): MobileTab => {
    const currentPath = pathname.split("/").pop() || "home";
    const tab = TABS.find((t) => t.path.includes(currentPath));
    return tab?.id || "home";
  };

  const activeTab = getActiveTab();
  const shouldReduceMotion = prefersReducedMotion;
  const isDark = theme === "dark";

  // Indicateur de l'onglet actif : ressort quasi-critique, pas de rebond
  // perceptible — un mouvement "premium" est un mouvement qui s'arrête net,
  // pas un mouvement qui rebondit.
  const springTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 300, damping: 32, mass: 0.9 };

  // Micro-pop de l'icône sélectionnée : un souffle de vie, discret
  const iconTransition = shouldReduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 260, damping: 22, mass: 0.7 };

  const tapTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.16, ease: "easeOut" as const };

  // Apparition/disparition de la barre : courbe "ease-out expo", la même
  // famille que les transitions natives iOS — fluide, sans spring visible.
  const visibilityTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const };

  const handleTabClick = (tab: TabConfig) => {
    router.push(tab.path);
  };

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden pwa-only pointer-events-none"
      role="navigation"
      aria-label="Navigation principale"
    >
      <motion.div
        animate={{
          y: isVisible ? 0 : "130%",
          opacity: isVisible ? 1 : 0,
        }}
        transition={visibilityTransition}
        className="pointer-events-auto"
      >
        <div className="pointer-events-none absolute -top-12 left-0 right-0 h-12 bg-gradient-to-t from-card/70 to-transparent" />

        <div className="px-4 pt-2 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div
            className="relative mx-auto flex max-w-md items-stretch gap-0.5 rounded-[28px] border border-subtle
                       bg-card/95 backdrop-blur-2xl px-1.5 py-1.5"
            style={{
              boxShadow: isDark
                ? "0 20px 44px -14px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)"
                : "0 20px 44px -14px rgba(15,23,42,0.24), 0 3px 12px -3px rgba(15,23,42,0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
            }}
          >
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab)}
                  aria-label={tab.label}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex-1 select-none touch-manipulation rounded-[22px] outline-none
                             focus-visible:ring-2 focus-visible:ring-primary/40 transition-all"
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeTabBackground"
                      className="absolute inset-0 rounded-[22px] bg-primary/10"
                      transition={springTransition}
                    />
                  )}

                  <motion.span
                    className="relative z-10 flex flex-col items-center justify-center gap-1 py-2"
                    whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
                    transition={tapTransition}
                  >
                    <motion.span
                      className="flex items-center justify-center"
                      animate={{ scale: isActive ? 1.06 : 1 }}
                      transition={iconTransition}
                    >
                      <Icon
                        className={`h-[21px] w-[21px] shrink-0 transition-colors duration-200 ${
                          isActive ? "text-primary" : "text-muted"
                        }`}
                        strokeWidth={isActive ? 2.25 : 1.75}
                      />
                    </motion.span>
                    <span
                      className={`whitespace-nowrap text-[10.5px] font-semibold tracking-tight transition-colors duration-200 ${
                        isActive ? "text-primary" : "text-muted"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </motion.span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </nav>
  );
};
