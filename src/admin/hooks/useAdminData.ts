// useAdminData.ts
import { useCallback, useEffect, useState } from "react";
import { deleteItem, getAll, insertItem, updateItem } from "../config/database";
import { DatabaseItem, TableName } from "../types";

interface UseAdminDataReturn {
  data: DatabaseItem[];
  isLoading: boolean;
  error: string | null;
  loadData: () => Promise<void>;
  onSave: (item: DatabaseItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

/**
 * Hook personnalisé pour gérer les données du tableau de bord admin
 * Gère le chargement, l'insertion, la mise à jour et la suppression des données
 */
export function useAdminData(activeTable: TableName): UseAdminDataReturn {
  const [data, setData] = useState<DatabaseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les données de la table active
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      console.log(`[useAdminData] 📡 Loading data from table: ${activeTable}`);
      const fetchedData = await getAll(activeTable);
      console.log(
        `[useAdminData] ✅ Loaded ${fetchedData.length} items from ${activeTable}`,
        fetchedData,
      );
      setData(fetchedData);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Erreur de chargement des données";
      console.error(`[useAdminData] ❌ Error loading ${activeTable}:`, err);
      setError(errorMsg);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeTable]);

  // Recharger quand la table active change
  useEffect(() => {
    const fetchData = async () => {
      await loadData();
    };

    void fetchData();
  }, [loadData]);

  // Ajouter ou mettre à jour un élément
  const onSave = useCallback(
    async (item: DatabaseItem) => {
      try {
        if (item.id) {
          // Mettre à jour
          console.log(
            `[useAdminData] ✏️ Updating item in ${activeTable}:`,
            item,
          );
          await updateItem(activeTable, item.id, item);
        } else {
          // Créer - l'ID sera généré par Supabase
          console.log(
            `[useAdminData] ➕ Creating new item in ${activeTable}:`,
            item,
          );
          await insertItem(activeTable, item);
        }
        // Recharger les données après succès
        await loadData();
      } catch (error: unknown) {
        console.error("[useAdminData] ❌ Error saving:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "Erreur lors de la sauvegarde",
        );
      }
    },
    [activeTable, loadData],
  );

  // Supprimer un élément
  const onDelete = useCallback(
    async (id: string) => {
      if (!id) {
        throw new Error("ID manquant pour la suppression");
      }

      try {
        console.log(
          `[useAdminData] 🗑️ Deleting item ${id} from ${activeTable}`,
        );
        await deleteItem(activeTable, id);
        // Recharger les données après succès
        await loadData();
      } catch (error: unknown) {
        console.error("[useAdminData] ❌ Error deleting:", error);
        throw new Error(
          error instanceof Error
            ? error.message
            : "Erreur lors de la suppression",
        );
      }
    },
    [activeTable, loadData],
  );

  return {
    data,
    isLoading,
    error,
    loadData,
    onSave,
    onDelete,
  };
}
