// page.tsx
"use client";

import {
  Calendar,
  FileText,
  ImageIcon,
  Mail,
  UserCircle,
  Users,
} from "lucide-react";
import { useCallback, useState } from "react";

// Imports des composants admin modulaires
import AdminGuard from "@/src/admin/components/AdminGuard";
import Header from "@/src/admin/components/Header";
import MainContent from "@/src/admin/components/MainContent";
import FormModal from "@/src/admin/components/modals/FormModal";
import SendMessagePanel from "@/src/admin/components/SendMessagePanel";
import Sidebar from "@/src/admin/components/Sidebar";

// Imports des hooks et services
import { logoutUser } from "@/src/admin/config/database";
import { useAdminData } from "@/src/admin/hooks/useAdminData";
import { DatabaseItem, NavItem, TableName } from "@/src/admin/types";

const NAVIGATION: NavItem[] = [
  { id: "events", label: "Événements", icon: Calendar },
  { id: "albums", label: "Albums Photos", icon: ImageIcon },
  { id: "reports", label: "Rapports", icon: FileText },
  { id: "bureau", label: "Membres du Bureau", icon: Users },
  { id: "profiles", label: "Profils Utilisateurs", icon: UserCircle },
  { id: "sendMessage", label: "Envoyer un message", icon: Mail },
];

/**
 * Page Admin - Tableau de bord pour gérer le contenu Supabase
 */
export default function AdminPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTable, setActiveTable] = useState<TableName | "sendMessage">(
    "events",
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DatabaseItem | null>(null);

  // Hook pour gérer les données (skip si sendMessage)
  const { data, isLoading, error, onSave, onDelete } = useAdminData(
    activeTable === "sendMessage" ? "events" : activeTable,
  );

  // Handlers mémoïsés pour éviter les re-renders inutiles
  const handleEdit = useCallback((item: DatabaseItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  }, []);

  const handleAddNew = useCallback(() => {
    setSelectedItem(null);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        !window.confirm(
          "Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.",
        )
      ) {
        return;
      }

      try {
        await onDelete(id);
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Delete error:", error);
        alert(`Erreur lors de la suppression: ${errorMessage}`);
      }
    },
    [onDelete],
  );

  const handleSaveModal = useCallback(
    async (savedData: DatabaseItem) => {
      try {
        await onSave(savedData);
      } catch (error: unknown) {
        console.error("Save error:", error);
        throw error instanceof Error ? error : new Error(String(error));
      }
    },
    [onSave],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    // Délai pour laisser l'animation se terminer avant de reset
    setTimeout(() => setSelectedItem(null), 300);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await logoutUser();
      window.location.href = "/login";
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      console.error("Logout error:", error);
      alert(`Erreur lors de la déconnexion: ${errorMessage}`);
    }
  }, []);

  const handleTableChange = useCallback(
    (tableId: string) => {
      setActiveTable(tableId as TableName | "sendMessage");
      // Fermer le modal si ouvert lors du changement de table
      if (isModalOpen) {
        handleCloseModal();
      }
    },
    [isModalOpen, handleCloseModal],
  );

  return (
    <AdminGuard>
      <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
        {/* Sidebar Navigation */}
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
          activeTable={activeTable}
          onTableChange={handleTableChange}
          navigation={NAVIGATION}
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          {/* Header */}
          {/* Header */}
          <Header
            activeTable={activeTable} // 👈 Plus besoin de forcer le type ici
            navigation={NAVIGATION}
            dataCount={activeTable === "sendMessage" ? 0 : data.length} // Évite d'afficher le compte des événements sur l'onglet mail
          />

          {/* Content Area */}
          {activeTable === "sendMessage" ? (
            <div className="flex-1 overflow-y-auto p-6">
              {/* Le modal d'email doit toujours être au-dessus de la sidebar */}
              <div className="relative z-50">
                <SendMessagePanel />
              </div>
            </div>
          ) : (
            <MainContent
              activeTable={activeTable as TableName}
              isLoading={isLoading}
              error={error}
              data={data}
              onAddNew={handleAddNew}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </main>

        {/* Form Modal */}
        {isModalOpen && (
          <FormModal
            table={activeTable}
            item={selectedItem}
            onClose={handleCloseModal}
            onSave={handleSaveModal}
          />
        )}
      </div>
    </AdminGuard>
  );
}
