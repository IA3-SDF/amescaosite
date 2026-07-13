"use client";

import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { usePWAStandalone } from "../hooks/usePWAStandalone";
import { getCurrentUserProfile, getMediaUrl } from "../services/supabase";
import { supabase } from "../services/supabase/client";
import { UserProfile } from "../types";
import { useLanguage } from "./LanguageContext";
import ProfileModal from "./ProfileModal";
import { useTheme } from "./ThemeContext";

// Hook dédié : détecte desktop/mobile en JS réel (pas juste CSS)
// breakpoint aligné sur le "md" de Tailwind (768px)
function useIsDesktop(breakpointPx = 768) {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [breakpointPx]);

  return isDesktop; // null tant que non déterminé (évite un flash SSR)
}

// Nouveau hook dédié : affine l'affichage PWA selon la largeur réelle du viewport.
// Ne pilote QUE la présentation (jamais l'état d'authentification ou le viewMode métier).
// - "xs"     : viewport <= 340px  -> on ne garde que le bouton Connexion
// - "sm"     : 340px < viewport <= 380px -> les deux boutons, en version resserrée
// - "normal" : viewport > 380px -> affichage classique inchangé
type PWAWidthTier = "xs" | "sm" | "normal";

function usePWAWidthTier(): PWAWidthTier {
  const [tier, setTier] = useState<PWAWidthTier>("normal");

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w <= 340) {
        setTier("xs");
      } else if (w <= 380) {
        setTier("sm");
      } else {
        setTier("normal");
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return tier;
}

const Navbar: React.FC = () => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const isStandalone = usePWAStandalone();
  const isDesktop = useIsDesktop();
  const pwaWidthTier = usePWAWidthTier();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("profile") === "1";
    }
    return false;
  });
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
      } catch {
        setProfile(null);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const navItems = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.events, path: "/events" },
    { name: t.nav.albums, path: "/albums" },
    { name: t.nav.contact, path: "/contact" },
    { name: t.nav.support, path: "/support" },
  ];

  const handleOpenProfile = () => {
    setIsMobileMenuOpen(false);
    setIsProfileOpen(true);
  };

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setShowLogoutConfirm(false);
      setIsMobileMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      setLogoutError(t.common.logoutError);
    }
  };

  const isReady = isDesktop !== null && !loadingProfile;
  const isAuthenticated = !!profile;
  const isDark = theme === "dark";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const cardSurface = isDark
    ? "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
    : "border-slate-200 bg-slate-50/90 hover:border-slate-300 hover:bg-slate-100";

  type ViewMode =
    | "loading"
    | "desktop-auth"
    | "desktop-guest"
    | "mobile-pwa-auth"
    | "mobile-pwa-guest"
    | "mobile-browser-auth"
    | "mobile-browser-guest";

  const viewMode: ViewMode = useMemo(() => {
    if (!isReady) return "loading";
    if (isDesktop) {
      return isAuthenticated ? "desktop-auth" : "desktop-guest";
    }
    if (isStandalone) {
      return isAuthenticated ? "mobile-pwa-auth" : "mobile-pwa-guest";
    }
    return isAuthenticated ? "mobile-browser-auth" : "mobile-browser-guest";
  }, [isReady, isDesktop, isStandalone, isAuthenticated]);

  // Uniquement pour l'affinage visuel du mode PWA invité (aucun impact sur la logique métier)
  const isPwaGuestCompact =
    viewMode === "mobile-pwa-guest" && pwaWidthTier !== "normal";
  const isPwaGuestXs = viewMode === "mobile-pwa-guest" && pwaWidthTier === "xs";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-subtle pt-[env(safe-area-inset-top)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-16 gap-2">
            {/* Logo */}
            <Link
              href="/"
              className={`flex items-center group flex-shrink-0 min-w-0 transition-all ${
                isPwaGuestCompact ? "space-x-2" : "space-x-3"
              }`}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "anticipate" }}
                className={`relative overflow-hidden rounded-2xl border border-black/5 bg-[#f8f6ef] p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)] flex-shrink-0 transition-all ${
                  isPwaGuestXs ? "h-10 w-10" : "h-12 w-12"
                }`}
              >
                <Image
                  src="/AMESCAO.PrincipalLogoIcon.svg"
                  alt="AMESCAO Logo"
                  fill
                  sizes="48px"
                  className="object-contain"
                  priority
                />
              </motion.div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base tracking-tight text-main leading-none truncate">
                  AMESCAO
                </span>
                {/* Le tagline est masqué en PWA invité très étroit (<=340px) pour libérer de la place */}
                {!isPwaGuestXs && (
                  <span className="text-[7px] font-semibold uppercase tracking-[0.15em] text-primary">
                    Aouda, Togo
                  </span>
                )}
              </div>
            </Link>

            {/* DESKTOP Navigation tabs */}
            {(viewMode === "desktop-auth" || viewMode === "desktop-guest") && (
              <div className="flex items-center justify-center flex-1 min-w-0 space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`relative px-3 py-2 text-xs font-bold uppercase tracking-wide whitespace-nowrap transition-all duration-300 rounded-lg overflow-hidden group ${
                      pathname === item.path
                        ? "text-primary"
                        : "text-muted hover:text-body"
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {pathname === item.path && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 bg-primary/10 rounded-xl z-0"
                      />
                    )}
                  </Link>
                ))}
              </div>
            )}

            {/* Right side bar actions */}
            <div
              className={`flex items-center flex-shrink-0 transition-all ${
                isPwaGuestCompact
                  ? pwaWidthTier === "xs"
                    ? "gap-1"
                    : "gap-1.5"
                  : "gap-1.5 sm:gap-2"
              }`}
            >
              <button
                onClick={toggleTheme}
                className={`rounded-xl hover:bg-secondary transition-all flex items-center justify-center text-muted flex-shrink-0 ${
                  isPwaGuestXs ? "w-9 h-9" : "w-10 h-10"
                }`}
                aria-label={
                  theme === "light"
                    ? t.common.themeToggleLight
                    : t.common.themeToggleDark
                }
              >
                {theme === "light" ? (
                  <Moon size={isPwaGuestXs ? 18 : 20} />
                ) : (
                  <Sun size={isPwaGuestXs ? 18 : 20} />
                )}
              </button>

              {viewMode === "loading" && (
                <div className="w-10 h-10" aria-hidden="true" />
              )}

              {viewMode === "desktop-auth" && (
                <AvatarButton
                  profile={profile!}
                  onClick={() => setIsProfileOpen(true)}
                  t={t}
                />
              )}

              {viewMode === "desktop-guest" && <AuthButtons t={t} />}

              {viewMode === "mobile-pwa-auth" && (
                <AvatarButton
                  profile={profile!}
                  onClick={() => setIsProfileOpen(true)}
                  t={t}
                />
              )}

              {viewMode === "mobile-pwa-guest" && (
                <AuthButtons compact tier={pwaWidthTier} t={t} />
              )}

              {(viewMode === "mobile-browser-auth" ||
                viewMode === "mobile-browser-guest") && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-10 h-10 rounded-xl hover:bg-secondary transition-all flex items-center justify-center text-muted flex-shrink-0"
                  aria-label={
                    isMobileMenuOpen ? t.common.closeMenu : t.common.openMenu
                  }
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Browser Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen &&
            (viewMode === "mobile-browser-auth" ||
              viewMode === "mobile-browser-guest") && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden glass border-t border-subtle overflow-y-auto max-h-[calc(100vh-64px)]"
              >
                <div className="px-4 py-6 space-y-6">
                  {viewMode === "mobile-browser-auth" ? (
                    <>
                      <div className="space-y-3">
                        <button
                          onClick={handleOpenProfile}
                          className={`w-full px-4 py-3 rounded-[24px] border text-left transition-all duration-200 ${cardSurface}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex items-center justify-center w-10 h-10 rounded-2xl ${isDark ? "bg-white/10" : "bg-slate-100"} flex-shrink-0`}
                            >
                              <svg
                                className={`w-5 h-5 ${isDark ? "text-slate-200" : "text-slate-700"}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p
                                className={`font-semibold text-sm ${textPrimary}`}
                              >
                                {t.common.account}
                              </p>
                              <p className={`text-xs ${textSecondary}`}>
                                {t.common.accountDescription}
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>

                      <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full px-4 py-2.5 rounded-lg text-xs font-bold text-center bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50 transition-all flex items-center gap-2 justify-center"
                      >
                        <LogOut size={16} />
                        {t.common.logout}
                      </button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 rounded-lg text-xs font-bold text-center border border-primary text-primary hover:bg-primary/10 transition-all"
                      >
                        {t.common.login}
                      </Link>
                      <Link
                        href="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="px-4 py-2.5 rounded-lg text-xs font-bold text-center border transition-all hover:opacity-90"
                        style={{
                          backgroundColor: "#059669",
                          color: "#ffffff",
                          borderColor: "#059669",
                        }}
                      >
                        {t.common.signup}
                      </Link>
                    </div>
                  )}

                  <div className="h-px bg-gradient-to-r from-transparent via-subtle to-transparent" />

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted px-3">
                      {t.common.navigation}
                    </p>
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-lg font-bold transition-all ${
                          pathname === item.path
                            ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                            : "text-body hover:bg-secondary hover:text-body"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </nav>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowLogoutConfirm(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-modal-title"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-subtle rounded-2xl shadow-2xl p-6 max-w-sm"
            >
              <h3
                id="logout-modal-title"
                className="text-lg font-black uppercase tracking-wider text-heading mb-2"
              >
                {t.common.logoutConfirmTitle}
              </h3>
              <p className="text-sm text-muted mb-6">
                {t.common.logoutConfirmDescription}
              </p>
              {logoutError && (
                <p className="text-sm text-red-500 mb-4 bg-red-500/10 p-3 rounded-lg">
                  {logoutError}
                </p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest border border-subtle text-muted hover:bg-secondary transition-all"
                >
                  {t.common.logoutConfirmCancel}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  {t.common.logoutConfirmAction}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

// Sub-components
const getAvatarUrl = (profile: UserProfile): string | undefined =>
  profile.photo || profile.googleAvatarUrl;

const getInitials = (name: string, surname: string): string => {
  const first = name.trim().charAt(0);
  const second = surname.trim().charAt(0);

  if (first && second) {
    return `${first}${second}`.toUpperCase();
  }

  return first.toUpperCase();
};

const AvatarButton: React.FC<{
  profile: UserProfile;
  onClick: () => void;
  t: ReturnType<typeof useLanguage>["t"];
}> = ({ profile, onClick, t }) => {
  const avatarUrl = getAvatarUrl(profile);
  const initials = getInitials(profile.name, profile.surname);

  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary overflow-hidden hover:border-accent transition-all flex-shrink-0"
      title={`${profile.name} ${profile.surname}`}
      aria-label={`${t.common.profileOf} ${profile.name} ${profile.surname}`}
    >
      {avatarUrl ? (
        <Image
          src={getMediaUrl(avatarUrl)}
          alt={`${profile.name} ${profile.surname}`}
          fill
          sizes="40px"
          className="object-cover"
          referrerPolicy="no-referrer"
          unoptimized={avatarUrl.startsWith("http")}
        />
      ) : (
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
      )}
    </button>
  );
};

// AuthButtons : le prop `tier` ne concerne QUE le mode PWA invité et pilote
// exclusivement l'apparence (taille de police, padding, gap, et présence du
// bouton "S'inscrire") — jamais la logique d'authentification.
const AuthButtons: React.FC<{
  compact?: boolean;
  tier?: PWAWidthTier;
  t: ReturnType<typeof useLanguage>["t"];
}> = ({ tier = "normal", t }) => {
  // <= 340px : on ne garde que le bouton Connexion, très compact
  if (tier === "xs") {
    return (
      <div className="flex items-center flex-shrink-0">
        <Link
          href="/login"
          className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg border border-primary whitespace-nowrap transition-all"
          style={{ color: "var(--color-primary, #059669)" }}
        >
          {t.common.login}
        </Link>
      </div>
    );
  }

  // 341px - 380px : les deux boutons, mais resserrés (police, padding, gap réduits)
  const isTight = tier === "sm";

  return (
    <div
      className={`flex items-center flex-shrink-0 transition-all ${
        isTight ? "gap-1" : "gap-2"
      }`}
    >
      <Link
        href="/login"
        className={`rounded-lg border border-primary whitespace-nowrap transition-all ${
          isTight ? "px-2 py-1.5 text-[10px]" : "px-3 py-2 text-xs"
        }`}
        style={{ color: "var(--color-primary, #059669)" }}
      >
        {t.common.login}
      </Link>
      <Link
        href="/signup"
        className={`rounded-lg border whitespace-nowrap transition-all hover:opacity-90 ${
          isTight ? "px-2 py-1.5 text-[10px]" : "px-3 py-2 text-xs"
        }`}
        style={{
          backgroundColor: "#059669",
          borderColor: "#059669",
          color: "#ffffff",
        }}
      >
        {t.common.signup}
      </Link>
    </div>
  );
};

export default Navbar;
