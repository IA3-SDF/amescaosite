// AdminGuard.tsx
"use client";

import { AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getCurrentUserProfile, isCurrentUserAdmin } from "../config/database";
import { UserProfile } from "../types";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * Composant de protection admin
 * Vérifie que l'utilisateur est authentifié ET a le rôle admin
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        console.log("[AdminGuard] 🔐 Verifying admin access...");

        // Vérifier d'abord si l'utilisateur est admin (vérifie aussi l'auth)
        const adminStatus = await isCurrentUserAdmin();

        if (!adminStatus) {
          // Récupérer le profil pour savoir si c'est un problème d'auth ou de rôle
          const profile = await getCurrentUserProfile();

          if (!profile) {
            setError(
              "Aucun profil utilisateur trouvé. Veuillez vous connecter.",
            );
            console.warn(
              "[AdminGuard] ⚠️ No profile found - user not authenticated",
            );
          } else {
            setUser(profile);
            setError(
              "Accès réservé. Vous n'avez pas les droits administrateur.",
            );
            console.warn(
              `[AdminGuard] 🚫 User ${profile.email} has role "${profile.role}", not admin`,
            );
          }
          setIsAdmin(false);
        } else {
          const profile = await getCurrentUserProfile();
          setUser(profile);
          setIsAdmin(true);
          console.log(
            "[AdminGuard] ✅ Admin access granted for:",
            profile?.email,
          );
        }
      } catch (err) {
        console.error("[AdminGuard] ❌ Error verifying admin:", err);
        setError("Erreur lors de la vérification des droits d'accès");
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const handleRedirectToLogin = () => {
    router.push("/auth/login");
  };

  const handleRedirectToHome = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l&apos;accès admin...</p>
        </div>
      </div>
    );
  }

  // Utilisateur non authentifié
  if (error && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-8 bg-white shadow-xl rounded-xl border-l-4 border-red-500 max-w-md">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Erreur d&apos;Accès
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRedirectToLogin}
            className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  // Utilisateur authentifié mais pas admin
  if (error && user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center p-8 bg-white shadow-xl rounded-xl border-l-4 border-orange-500 max-w-md">
          <ShieldAlert className="mx-auto h-12 w-12 text-orange-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Accès Refusé</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRedirectToHome}
            className="inline-block px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Retour à l&apos;accueil
          </button>
        </div>
      </div>
    );
  }

  // Accès autorisé
  if (isAdmin && user) {
    return <>{children}</>;
  }

  // Fallback sécurité
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center p-8 bg-white shadow-xl rounded-xl border-l-4 border-red-500 max-w-md">
        <ShieldAlert className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Erreur Inattendue
        </h2>
        <p className="text-gray-600 mb-6">
          Impossible de vérifier vos droits d&apos;accès.
        </p>
        <button
          onClick={handleRedirectToLogin}
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Se reconnecter
        </button>
      </div>
    </div>
  );
}
