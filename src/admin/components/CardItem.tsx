// CardItem.tsx
"use client";

import { Calendar, FileText, ImageIcon, Trash2, User } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { getMediaUrl } from "../../services/supabase";
import { DatabaseItem, TableName } from "../types";

interface CardItemProps {
  item: DatabaseItem;
  onEdit: (item: DatabaseItem) => void;
  onDelete: (id: string) => void;
  activeTable?: TableName;
}

/**
 * Carte d'affichage d'un élément (utilisée dans la grille)
 */
export default function CardItem({
  item,
  onEdit,
  onDelete,
  activeTable,
}: CardItemProps) {
  const [imageError, setImageError] = useState(false);
  const isProfilesTable = activeTable === "profiles";

  const getTextValue = (value: unknown): string | undefined => {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    return undefined;
  };

  // Extraire les infos principales avec fallback
  const title =
    getTextValue(item.title) ||
    getTextValue(item.name) ||
    getTextValue(item.event_title) ||
    "Sans titre";
  const subtitle =
    getTextValue(item.role) ||
    getTextValue(item.date) ||
    getTextValue(item.event_date) ||
    getTextValue(item.email) ||
    "";

  // Déterminer l'image à afficher (priorité: cover_photo > photo > photos[0])
  const getPhotoUrl = (): string | null => {
    if (item.cover_photo && typeof item.cover_photo === "string")
      return item.cover_photo;
    if (item.photo && typeof item.photo === "string") return item.photo;
    if (
      Array.isArray(item.photos) &&
      item.photos.length > 0 &&
      typeof item.photos[0] === "string"
    ) {
      return item.photos[0];
    }
    if (
      Array.isArray(item.other_photos) &&
      item.other_photos.length > 0 &&
      typeof item.other_photos[0] === "string"
    ) {
      return item.other_photos[0];
    }
    return null;
  };

  const photo = getPhotoUrl();

  // Formater la date si c'est un timestamp ISO
  const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr; // Retourner tel quel si invalide
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: dateStr.includes("T") ? "2-digit" : undefined,
        minute: dateStr.includes("T") ? "2-digit" : undefined,
      });
    } catch {
      return dateStr;
    }
  };

  const displaySubtitle =
    subtitle && (subtitle.includes("T") || /^\d{4}-\d{2}-\d{2}/.test(subtitle))
      ? formatDate(subtitle)
      : subtitle;

  // Déterminer l'icône de fallback selon le type de contenu
  const getFallbackIcon = () => {
    if (item.date || item.event_date) return <Calendar size={24} />;
    if (item.email) return <User size={24} />;
    if (item.photos || item.other_photos || item.cover_photo)
      return <ImageIcon size={24} />;
    return <FileText size={24} />;
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) {
      onDelete(item.id);
    }
  };

  // Rendu spécifique pour la table profiles (ligne complète)
  if (isProfilesTable) {
    const profilePhoto = getPhotoUrl();
    const createdAt = getTextValue(item.created_at)
      ? formatDate(getTextValue(item.created_at))
      : "";
    const profileName = getTextValue(item.name) ?? "";
    const profileSurname = getTextValue(item.surname) ?? "";
    const profileRole = getTextValue(item.role) ?? "N/A";
    const profileEmail = getTextValue(item.email) ?? "N/A";

    return (
      <div
        className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group cursor-pointer w-full"
        onClick={() => onEdit(item)}
      >
        <div className="flex items-center gap-4 flex-1">
          {/* Photo en petit cercle */}
          {profilePhoto && !imageError ? (
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
              <Image
                src={getMediaUrl(profilePhoto)}
                alt={profileName || "Profil utilisateur"}
                fill
                sizes="40px"
                className="object-cover"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-600 shrink-0 text-xs font-bold border border-gray-200">
              {profileName.charAt(0)}
              {profileSurname.charAt(0)}
            </div>
          )}

          {/* Infos profil en ligne */}
          <div className="flex-1 min-w-0 grid grid-cols-4 gap-4">
            {/* Nom et Prénom */}
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {profileName}
              </p>
              <p className="text-xs text-gray-500 truncate">{profileSurname}</p>
            </div>

            {/* Rôle */}
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Rôle
              </p>
              <span
                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                  item.role === "admin"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {profileRole}
              </span>
            </div>

            {/* Email */}
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Email
              </p>
              <p className="text-sm text-gray-700 truncate font-mono">
                {profileEmail}
              </p>
            </div>

            {/* Date de création */}
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Crée le
              </p>
              <p className="text-xs text-gray-600">{createdAt || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Bouton supprimer */}
        <button
          onClick={handleDelete}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2 focus:opacity-100"
          title="Supprimer"
          type="button"
        >
          <Trash2 size={20} />
        </button>
      </div>
    );
  }

  const profileName = getTextValue(item.name) ?? "";
  const profileSurname = getTextValue(item.surname) ?? "";

  // Rendu standard pour les autres tables
  return (
    <div
      className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex justify-between items-center group cursor-pointer"
      onClick={() => onEdit(item)}
    >
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        {/* Image ou icône */}
        {photo && !imageError ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            <Image
              src={photo}
              alt={title || "Image"}
              fill
              sizes="48px"
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
            {getFallbackIcon()}
          </div>
        )}

        {/* Info texte */}
        <div className="truncate flex-1 min-w-0">
          <p className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors truncate text-sm">
            {title}
          </p>
          {displaySubtitle && (
            <p className="text-sm text-gray-500 truncate">{displaySubtitle}</p>
          )}
          {profileSurname && profileName !== profileSurname && (
            <p className="text-xs text-gray-400 truncate">
              {profileSurname} {profileName}
            </p>
          )}
        </div>
      </div>

      {/* Bouton supprimer */}
      <button
        onClick={handleDelete}
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 shrink-0 ml-2 focus:opacity-100"
        title="Supprimer"
        type="button"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
}
