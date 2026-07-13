"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  ChevronRight,
  Edit2,
  FileText,
  Globe2,
  LogOut,
  Moon,
  Save,
  Shield,
  Sun,
  Trash2,
  User,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { uploadFile } from "../admin/config/database";
import {
  getCurrentUserProfile,
  getMediaUrl,
  updateUserProfile,
} from "../services/supabase";
import { supabase } from "../services/supabase/client";
import { Language, UserProfile } from "../types";
import { useLanguage } from "./LanguageContext";
import { useTheme } from "./ThemeContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";
  const textPrimary = isDark ? "text-slate-100" : "text-slate-900";
  const textSecondary = isDark ? "text-slate-400" : "text-slate-500";
  const textMuted = isDark ? "text-slate-300" : "text-slate-600";
  const borderSoft = isDark ? "border-white/10" : "border-slate-200/85";
  const surfaceElevated = isDark
    ? "bg-slate-950/95 border-white/10 shadow-[0_35px_120px_rgba(15,23,42,0.35)]"
    : "bg-white/90 border-slate-200/80 shadow-[0_35px_120px_rgba(15,23,42,0.15)]";
  const surfaceHeader = isDark
    ? "bg-slate-950/70 border-white/10"
    : "bg-white/80 border-slate-200/80";
  const surfaceCard = isDark
    ? "border-white/10 bg-white/5"
    : "border-slate-200 bg-slate-50/90";
  const inputClass = isDark
    ? "bg-slate-900/80 border-white/10 text-slate-100 placeholder-slate-500 focus:border-white/20 focus:bg-slate-900/90"
    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:bg-white";
  const buttonSecondaryClass = isDark
    ? "border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
    : "border-slate-200 bg-slate-50 text-slate-900 hover:bg-slate-100";
  const buttonPrimaryClass = isDark
    ? "bg-white/10 text-slate-100 hover:bg-white/15"
    : "bg-slate-900 text-white hover:bg-slate-800";

  // Styles réutilisés pour la liste de réglages compacte (mobile & desktop)
  const rowHoverClass = isDark ? "hover:bg-white/5" : "hover:bg-slate-100/70";
  const rowIconWrapClass = `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
    isDark ? "bg-white/10" : "bg-slate-100"
  }`;
  const rowIconColorClass = isDark ? "text-slate-200" : "text-slate-700";
  const rowTitleClass = `text-sm font-medium leading-tight ${textPrimary} truncate`;
  const rowDescClass = `mt-0.5 text-xs leading-tight ${textSecondary} truncate`;
  const rowBadgeClass = `rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] flex-shrink-0 ${
    isDark
      ? "border-white/10 bg-white/10 text-slate-300"
      : "border-slate-200 bg-slate-100 text-slate-700"
  }`;
  const rowChevronClass = `flex-shrink-0 ${textSecondary}`;
  const groupContainerClass = `overflow-hidden rounded-2xl border divide-y ${
    isDark
      ? "border-white/10 divide-white/10 bg-white/5"
      : "border-slate-200 divide-slate-200 bg-slate-50/80"
  }`;

  const getAvatarUrl = (
    profile: UserProfile,
    editedProfile: Partial<UserProfile>,
  ): string | undefined =>
    editedProfile.photo || profile.photo || profile.googleAvatarUrl;

  const getInitials = (name: string, surname: string): string => {
    const first = name.trim().charAt(0);
    const second = surname.trim().charAt(0);

    if (first && second) {
      return `${first}${second}`.toUpperCase();
    }

    return first.toUpperCase();
  };

  const showNotification = useCallback(
    (type: "success" | "error", message: string) => {
      setNotification({ type, message });
      setTimeout(() => setNotification(null), 3000);
    },
    [],
  );

  useEffect(() => {
    if (!isOpen || profile) return;

    const loadProfile = async () => {
      setLoading(true);
      try {
        const userProfile = await getCurrentUserProfile();
        setProfile(userProfile);
        if (userProfile) {
          setEditedProfile(userProfile);
        }
      } catch {
        showNotification("error", t.profile.errorProfileLoad);
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [isOpen, profile, showNotification, t.profile.errorProfileLoad]);

  const closeProfile = () => {
    setShowLanguageModal(false);
    onClose();
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setProfile(null);
      closeProfile();
      window.location.href = "/login";
    } else {
      showNotification("error", t.profile.errorLogout);
    }
    setShowLogoutConfirm(false);
  };

  const handleLanguageButtonClick = () => {
    setShowLanguageModal(true);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    showNotification(
      "success",
      lang === "fr" ? t.profile.languageChangedFr : t.profile.languageChangedEn,
    );
    setShowLanguageModal(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNotification(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setEditedProfile(profile);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const success = await updateUserProfile(editedProfile);
    if (success) {
      const updatedProfile = await getCurrentUserProfile();
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile ?? {});
      setIsEditing(false);
      showNotification("success", t.profile.successProfileUpdated);
    } else {
      showNotification("error", t.profile.errorProfileUpdated);
    }
    setIsSaving(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditedProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setIsUploadingPhoto(true);
        const uploadedUrl = await uploadFile(file);
        setEditedProfile((prev) => ({ ...prev, photo: uploadedUrl }));
        showNotification("success", t.profile.successPhotoUpdated);
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : t.profile.errorPhotoUpload;
        showNotification("error", errorMsg);
      } finally {
        setIsUploadingPhoto(false);
      }
    }
  };

  const handleRemovePhoto = () => {
    setEditedProfile((prev) => ({ ...prev, photo: undefined }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Conteneur plein écran mobile / carte flottante ancrée à droite sur desktop */}
          <div className="fixed inset-0 z-50 flex sm:items-center sm:justify-end sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`absolute inset-0 ${isDark ? "bg-black/40" : "bg-slate-900/30"} backdrop-blur-[2px]`}
              onClick={closeProfile}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className={`relative z-10 flex h-full w-full flex-col overflow-hidden border backdrop-blur-3xl sm:h-[min(88vh,720px)] sm:w-[408px] sm:rounded-[28px] ${surfaceElevated}`}
            >
              {/* Header — reste fixe, padding-top tient compte de l'encoche iOS */}
              <div
                className={`flex-shrink-0 border-b flex items-center justify-between px-5 sm:px-6 ${surfaceHeader}`}
                style={{
                  paddingTop: "calc(env(safe-area-inset-top) + 1.1rem)",
                  paddingBottom: "1.1rem",
                }}
              >
                <h2
                  className={`text-[15px] font-semibold ${textPrimary} tracking-tight`}
                >
                  {isEditing ? t.profile.editTitle : t.profile.title}
                </h2>
                <button
                  onClick={isEditing ? handleCancel : closeProfile}
                  className={`w-9 h-9 rounded-full border ${buttonSecondaryClass} flex items-center justify-center transition`}
                  aria-label={t.profile.close}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Corps scrollable UNIQUE — photo, infos et réglages défilent ensemble */}
              <div
                className="flex-1 overflow-y-auto px-5 sm:px-6"
                style={{
                  paddingTop: "1.5rem",
                  paddingBottom: "calc(env(safe-area-inset-bottom) + 1.5rem)",
                }}
              >
                {/* Notification — discrète, neutre */}
                <AnimatePresence>
                  {notification && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className={`mb-5 px-3.5 py-3 rounded-2xl flex items-center gap-3 text-[13px] ${isDark ? "bg-white/10 text-slate-100 border-white/10" : "bg-slate-50 text-slate-900 border-slate-200"} border shadow-[0_18px_45px_rgba(15,23,42,0.16)]`}
                    >
                      {notification.type === "success" ? (
                        <CheckCircle
                          size={16}
                          className="text-primary flex-shrink-0"
                        />
                      ) : (
                        <AlertTriangle
                          size={16}
                          className="text-amber-500 flex-shrink-0"
                        />
                      )}
                      <span>{notification.message}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {loading ? (
                  <div className="flex justify-center items-center py-16">
                    <div className="w-6 h-6 rounded-full border-2 border-white/10 border-t-slate-200 animate-spin" />
                  </div>
                ) : profile ? (
                  <>
                    {/* Photo */}
                    <div className="mb-8 flex flex-col items-center">
                      <div
                        className={`relative w-24 h-24 rounded-full border ${borderSoft} ${isDark ? "bg-slate-900/60" : "bg-slate-100/80"} shadow-[0_18px_45px_rgba(15,23,42,0.16)] backdrop-blur-xl overflow-hidden`}
                      >
                        {(() => {
                          const avatarUrl = getAvatarUrl(
                            profile,
                            editedProfile,
                          );
                          if (avatarUrl) {
                            return (
                              <Image
                                src={getMediaUrl(avatarUrl)}
                                alt={`${profile.name} ${profile.surname}`}
                                width={96}
                                height={96}
                                className={`w-24 h-24 rounded-full object-cover border ${borderSoft}`}
                                referrerPolicy="no-referrer"
                                unoptimized={avatarUrl.startsWith("http")}
                              />
                            );
                          }

                          return (
                            <div
                              className={`w-24 h-24 rounded-full ${isDark ? "bg-slate-900 text-slate-200" : "bg-white text-slate-900"} flex items-center justify-center`}
                            >
                              <span className="text-3xl font-semibold uppercase">
                                {getInitials(
                                  editedProfile.name || profile.name,
                                  editedProfile.surname || profile.surname,
                                )}
                              </span>
                            </div>
                          );
                        })()}

                        {isEditing && (
                          <label
                            className={`absolute inset-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-full border ${isDark ? "border-white/25 bg-slate-950/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] hover:bg-slate-950/80 focus-within:bg-slate-950/80" : "border-slate-200/80 bg-white/80 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] hover:bg-white focus-within:bg-white"} transition-all duration-200 hover:scale-[1.02] focus-within:scale-[1.02]`}
                          >
                            <span
                              className={`flex flex-col items-center justify-center gap-1 rounded-2xl border px-2.5 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.24em] shadow-sm backdrop-blur-sm ${isDark ? "border-white/15 bg-white/10 text-white" : "border-slate-200 bg-white text-slate-700"}`}
                            >
                              <Camera size={15} className="shrink-0" />
                              <span className="leading-[1.1]">
                                {editedProfile.photo || profile.photo
                                  ? t.profile.photoEdit
                                  : t.profile.photoAdd}
                              </span>
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePhotoUpload}
                              disabled={isUploadingPhoto}
                            />
                          </label>
                        )}

                        {isUploadingPhoto && (
                          <div className="absolute inset-0 rounded-full bg-black/55 flex items-center justify-center">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      {isEditing &&
                        (editedProfile.photo ||
                          (profile.photo &&
                            profile.photo !== profile.googleAvatarUrl)) && (
                          <button
                            onClick={handleRemovePhoto}
                            className={`mt-3 text-[12px] ${textSecondary} hover:text-red-400 transition-colors flex items-center gap-1`}
                          >
                            <Trash2 size={12} />
                            {t.profile.photoRemove}
                          </button>
                        )}
                    </div>

                    {/* Edit Mode */}
                    {isEditing ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-5"
                      >
                        {/* Nom */}
                        <div>
                          <label
                            className={`block text-[11px] font-semibold uppercase tracking-wide ${textSecondary} mb-1.5`}
                          >
                            {t.profile.nameLabel}
                          </label>
                          <input
                            type="text"
                            value={editedProfile.name || ""}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            className={`w-full px-3.5 py-2.5 rounded-2xl text-sm transition-colors ${inputClass}`}
                            placeholder={t.profile.namePlaceholder}
                          />
                        </div>

                        {/* Prénom */}
                        <div>
                          <label
                            className={`block text-[11px] font-semibold uppercase tracking-wide ${textSecondary} mb-1.5`}
                          >
                            {t.profile.surnameLabel}
                          </label>
                          <input
                            type="text"
                            value={editedProfile.surname || ""}
                            onChange={(e) =>
                              handleInputChange("surname", e.target.value)
                            }
                            className={`w-full px-3.5 py-2.5 rounded-2xl text-sm transition-colors ${inputClass}`}
                            placeholder={t.profile.surnamePlaceholder}
                          />
                        </div>

                        {/* Email */}
                        <div>
                          <label
                            className={`block text-[11px] font-semibold uppercase tracking-wide ${textSecondary} mb-1.5`}
                          >
                            {t.profile.emailLabel}
                          </label>
                          <div
                            className={`px-3.5 py-2.5 rounded-2xl ${isDark ? "bg-slate-900/70 text-slate-300" : "bg-slate-50 text-slate-700"} text-sm`}
                          >
                            {editedProfile.email}
                          </div>
                          <p className={`text-[11px] ${textSecondary} mt-1.5`}>
                            {t.profile.emailReadonly}
                          </p>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <button
                            onClick={handleCancel}
                            className={`px-4 py-3 rounded-2xl border text-sm font-medium transition-colors ${buttonSecondaryClass}`}
                          >
                            {t.profile.cancel}
                          </button>
                          <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${buttonPrimaryClass}`}
                          >
                            {isSaving ? (
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Save size={15} />
                                {t.profile.save}
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      /* Display Mode */
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <p
                          className={`text-xl font-semibold ${textPrimary} mb-1`}
                        >
                          {profile.name} {profile.surname}
                        </p>
                        <p className={`text-sm ${textSecondary} break-all`}>
                          {profile.email}
                        </p>
                        {profile.role && profile.role !== "member" && (
                          <p
                            className={`mt-3 inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${isDark ? "border-white/10 bg-white/5 text-slate-300" : "border-slate-200 bg-slate-100 text-slate-700"}`}
                          >
                            {profile.role === "admin"
                              ? t.profile.roleAdmin
                              : profile.role === "moderator"
                                ? t.profile.roleModerator
                                : profile.role}
                          </p>
                        )}
                      </motion.div>
                    )}

                    {/* Réglages — intégrés au même flux de scroll (plus de "second écran") */}
                    {!isEditing && (
                      <div className="mt-8">
                        <div className={groupContainerClass}>
                          {/* Compte — ligne d'information statique */}
                          <div className="flex items-center gap-3 px-4 py-3.5">
                            <div className={rowIconWrapClass}>
                              <User size={16} className={rowIconColorClass} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={rowTitleClass}>
                                {t.profile.accountCardTitle}
                              </p>
                              <p className={rowDescClass}>
                                {t.profile.accountCardDescription}
                              </p>
                            </div>
                          </div>

                          {/* Modifier le profil */}
                          <button
                            onClick={handleEdit}
                            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${rowHoverClass}`}
                          >
                            <div className={rowIconWrapClass}>
                              <Edit2 size={16} className={rowIconColorClass} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={rowTitleClass}>{t.profile.edit}</p>
                            </div>
                            <ChevronRight
                              size={16}
                              className={rowChevronClass}
                            />
                          </button>

                          {/* Thème */}
                          <div className="flex items-center gap-3 px-4 py-3.5">
                            <div className={rowIconWrapClass}>
                              {isDark ? (
                                <Moon size={16} className={rowIconColorClass} />
                              ) : (
                                <Sun size={16} className={rowIconColorClass} />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={rowTitleClass}>
                                {t.profile.themeTitle}
                              </p>
                              <p className={rowDescClass}>
                                {isDark
                                  ? t.profile.themeDarkActive
                                  : t.profile.themeLightActive}
                              </p>
                            </div>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isDark}
                              onClick={toggleTheme}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
                                isDark ? "bg-primary" : "bg-slate-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                  isDark ? "translate-x-5" : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>

                          {/* Langue */}
                          <button
                            onClick={handleLanguageButtonClick}
                            className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors ${rowHoverClass}`}
                          >
                            <div className={rowIconWrapClass}>
                              <Globe2 size={16} className={rowIconColorClass} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={rowTitleClass}>
                                {t.profile.languageTitle}
                              </p>
                              <p className={rowDescClass}>
                                {t.profile.languageDescription}
                              </p>
                            </div>
                            <span className={rowBadgeClass}>
                              {language === "fr" ? "FR" : "EN"}
                            </span>
                          </button>

                          {/* Confidentialité */}
                          <Link
                            href="/privacy-policy?from=profile"
                            onClick={closeProfile}
                            className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${rowHoverClass}`}
                          >
                            <div className={rowIconWrapClass}>
                              <Shield size={16} className={rowIconColorClass} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={rowTitleClass}>
                                {t.profile.privacyTitle}
                              </p>
                              <p className={rowDescClass}>
                                {t.profile.privacyDescription}
                              </p>
                            </div>
                            <ChevronRight
                              size={16}
                              className={rowChevronClass}
                            />
                          </Link>

                          {/* Conditions */}
                          <Link
                            href="/terms?from=profile"
                            onClick={closeProfile}
                            className={`flex items-center gap-3 px-4 py-3.5 transition-colors ${rowHoverClass}`}
                          >
                            <div className={rowIconWrapClass}>
                              <FileText
                                size={16}
                                className={rowIconColorClass}
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={rowTitleClass}>
                                {t.profile.termsTitle}
                              </p>
                              <p className={rowDescClass}>
                                {t.profile.termsDescription}
                              </p>
                            </div>
                            <ChevronRight
                              size={16}
                              className={rowChevronClass}
                            />
                          </Link>
                        </div>

                        {/* Déconnexion — séparée, action destructive */}
                        <button
                          onClick={handleLogoutClick}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-3.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                        >
                          <LogOut size={15} />
                          {t.profile.logout}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <AlertTriangle size={32} className="text-amber-500 mb-4" />
                    <p className={`${textPrimary} font-medium mb-4 text-sm`}>
                      {t.profile.loadError}
                    </p>
                    <button
                      onClick={closeProfile}
                      className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${buttonPrimaryClass}`}
                    >
                      Fermer
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Logout Confirmation */}
          <AnimatePresence>
            {showLogoutConfirm && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
                onClick={() => setShowLogoutConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className={`w-full max-w-sm rounded-[28px] border p-6 ${surfaceElevated}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3
                    className={`font-semibold ${textPrimary} mb-2 text-[15px]`}
                  >
                    {t.profile.logoutConfirmTitle}
                  </h3>
                  <p className={`text-sm ${textSecondary} mb-6`}>
                    {t.profile.logoutConfirmDescription}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setShowLogoutConfirm(false)}
                      className={`px-4 py-2.5 rounded-2xl border text-sm font-medium transition-colors ${buttonSecondaryClass}`}
                    >
                      {t.profile.logoutConfirmCancel}
                    </button>
                    <button
                      onClick={confirmLogout}
                      className="px-4 py-2.5 rounded-2xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors"
                    >
                      {t.profile.logoutConfirmAction}
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Language Selection */}
          <AnimatePresence>
            {showLanguageModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`fixed inset-0 z-[60] flex items-center justify-center ${isDark ? "bg-slate-950/50" : "bg-slate-900/25"} p-4 backdrop-blur-sm`}
                onClick={() => setShowLanguageModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.96, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.96, opacity: 0 }}
                  className={`w-full max-w-[420px] rounded-[32px] border p-5 shadow-2xl backdrop-blur-3xl ${surfaceElevated}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div>
                      <p className={`text-base font-semibold ${textPrimary}`}>
                        {t.profile.languageModalTitle}
                      </p>
                      <p className={`mt-1 text-sm ${textSecondary}`}>
                        {t.profile.languageModalDescription}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowLanguageModal(false)}
                      className={`rounded-full p-2 transition-colors ${isDark ? "text-slate-300 hover:bg-white/10" : "text-slate-600 hover:bg-slate-100"}`}
                      aria-label={t.profile.close}
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      onClick={() => handleLanguageChange("fr")}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                        language === "fr"
                          ? isDark
                            ? "border-white/15 bg-white/10"
                            : "border-slate-300 bg-slate-100"
                          : isDark
                            ? "border-white/10 bg-slate-950/80 hover:border-white/20 hover:bg-white/10"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={`text-sm font-semibold ${textPrimary}`}>
                            {t.profile.languageFrench}
                          </p>
                          <p className={`mt-1 text-xs ${textSecondary}`}>
                            {t.profile.languageFrenchDescription}
                          </p>
                        </div>
                        {language === "fr" && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${isDark ? "bg-slate-800/80 text-slate-300" : "bg-slate-100 text-slate-700"}`}
                          >
                            {t.profile.activeLabel}
                          </span>
                        )}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 ${
                        language === "en"
                          ? isDark
                            ? "border-white/15 bg-white/10"
                            : "border-slate-300 bg-slate-100"
                          : isDark
                            ? "border-white/10 bg-slate-950/80 hover:border-white/20 hover:bg-white/10"
                            : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className={`text-sm font-semibold ${textPrimary}`}>
                            {t.profile.languageEnglish}
                          </p>
                          <p className={`mt-1 text-xs ${textSecondary}`}>
                            {t.profile.languageEnglishDescription}
                          </p>
                        </div>
                        {language === "en" && (
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${isDark ? "bg-slate-800/80 text-slate-300" : "bg-slate-100 text-slate-700"}`}
                          >
                            {t.profile.activeLabel}
                          </span>
                        )}
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowLanguageModal(false)}
                    className={`mt-5 w-full rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${isDark ? "border-white/10 bg-white/5 text-slate-100 hover:border-white/20 hover:bg-white/10" : "border-slate-200 bg-slate-50 text-slate-900 hover:border-slate-300 hover:bg-slate-100"}`}
                  >
                    Fermer
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
