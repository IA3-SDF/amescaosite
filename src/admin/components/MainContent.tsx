// MainContent.tsx
"use client";

import React from "react";
import { Plus, FileText, AlertCircle } from "lucide-react";
import CardItem from "./CardItem";
import { DatabaseItem, TableName } from "../types";

interface MainContentProps {
  activeTable: TableName;
  isLoading: boolean;
  error?: string | null;
  data: DatabaseItem[];
  onAddNew: () => void;
  onEdit: (item: DatabaseItem) => void;
  onDelete: (id: string) => void;
}

/**
 * Contenu principal - affiche la grille des éléments
 */
export default function MainContent({
  activeTable,
  isLoading,
  error,
  data,
  onAddNew,
  onEdit,
  onDelete,
}: MainContentProps) {
  return (
    <div className="flex-1 overflow-y-auto p-8 relative bg-gray-50">
      <div className="max-w-5xl mx-auto">
        {/* HEADER CONTENU */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-500">
              Gérez vos données de la table{" "}
              <strong className="text-gray-800 capitalize">
                {activeTable}
              </strong>
            </p>
            {error && (
              <div className="mt-2 flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus size={20} />
            Nouveau
          </button>
        </div>

        {/* CONTENU */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              Aucune donnée
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par ajouter un nouvel élément.
            </p>
            <button
              onClick={onAddNew}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus size={18} />
              Ajouter le premier élément
            </button>
          </div>
        ) : (
          <div
            className={
              activeTable === "profiles"
                ? "space-y-3"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            }
          >
            {data.map((item) => (
              <CardItem
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                activeTable={activeTable}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
