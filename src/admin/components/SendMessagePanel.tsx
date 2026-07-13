"use client";

import { useAdminData } from "@/src/admin/hooks/useAdminData";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader, Mail } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import EmailComposerModal from "./modals/EmailComposerModal";

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  name?: string;
  username?: string;
}

/**
 * Panneau d'envoi de messages en masse
 */
export default function SendMessagePanel() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Récupérer les profils depuis la base de données
  const { data: rawData, isLoading, error } = useAdminData("profiles");

  const profiles = useMemo<Profile[]>(() => {
    if (!rawData || !Array.isArray(rawData)) {
      return [];
    }

    return rawData
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : "",
        email: typeof item.email === "string" ? item.email : "",
        full_name:
          typeof item.full_name === "string"
            ? item.full_name
            : typeof item.name === "string"
              ? item.name
              : "Sans nom",
        name:
          typeof item.full_name === "string"
            ? item.full_name
            : typeof item.name === "string"
              ? item.name
              : "Sans nom",
        username: typeof item.username === "string" ? item.username : "",
      }))
      .filter((p) => p.email.trim().length > 0);
  }, [rawData]);

  const handleOpenModal = useCallback(() => {
    if (profiles.length === 0) {
      alert(
        "Aucun utilisateur avec email disponible. Assurez-vous que la table profiles contient des utilisateurs.",
      );
      return;
    }
    setIsModalOpen(true);
  }, [profiles.length]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mt-1">
            Composez et envoyez des emails à vos utilisateurs
          </p>
        </div>
      </div>

      {/* Card statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Utilisateurs</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {isLoading ? (
                  <Loader size={24} className="animate-spin" />
                ) : (
                  profiles.length
                )}
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-lg">
              <Mail size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div>
            <p className="text-gray-600 text-sm font-medium">État</p>
            <p className="text-lg font-semibold text-gray-900 mt-2">
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  Chargement...
                </span>
              ) : error ? (
                <span className="text-red-600">Erreur</span>
              ) : profiles.length > 0 ? (
                <span className="text-green-600">Prêt</span>
              ) : (
                <span className="text-yellow-600">Aucun utilisateur</span>
              )}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div>
            <p className="text-gray-600 text-sm font-medium">Action</p>
            <button
              onClick={handleOpenModal}
              disabled={isLoading || profiles.length === 0}
              className="mt-2 w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm"
            >
              {isLoading ? "Chargement..." : "Composer un email"}
            </button>
          </div>
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <AlertCircle
            size={20}
            className="text-red-600 flex-shrink-0 mt-0.5"
          />
          <div>
            <p className="font-medium text-red-700">Erreur de chargement</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">
            Utilisateurs disponibles
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Ces utilisateurs recevront vos emails
          </p>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <Loader
                size={24}
                className="animate-spin mx-auto text-gray-400 mb-2"
              />
              <p className="text-gray-500 text-sm">
                Chargement des utilisateurs...
              </p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="p-6 text-center">
              <AlertCircle size={24} className="mx-auto text-yellow-500 mb-2" />
              <p className="text-gray-600 text-sm">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            profiles.map((profile, idx) => (
              <motion.div
                key={profile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="px-6 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-emerald-700">
                      {profile.full_name?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {profile.full_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {profile.email}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Valide
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          {profiles.length} utilisateur{profiles.length !== 1 ? "s" : ""} au
          total
        </div>
      </div>

      {/* Modal de composition */}
      <AnimatePresence>
        {isModalOpen && (
          <EmailComposerModal
            recipients={profiles.map((p) => ({
              id: p.id,
              email: p.email,
              name: p.full_name || p.username || "Utilisateur",
            }))}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
