// Header.tsx
"use client";

import React from "react";
import { NavItem } from "../types";

interface HeaderProps {
  activeTable: string;
  navigation: NavItem[];
  dataCount: number;
}

export default function Header({
  activeTable,
  navigation,
  dataCount,
}: HeaderProps) {
  // Recherche l'élément dans la navigation
  const activeNav = navigation.find((n) => n.id === activeTable);

  // Si on est sur "sendMessage", on ne veut pas afficher le compteur global
  const showCount = activeTable !== "sendMessage";

  return (
    <header className="h-16 bg-slate-900 text-white border-b border-slate-800 flex items-center px-8 shrink-0">
      <div className="flex items-center gap-3 select-none">
        <h1 className="text-white! text-xl font-extrabold tracking-tight normal-case">
          {activeNav?.label || "Tableau de bord"}
        </h1>
        {showCount && (
          <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2 shadow shadow-blue-900/20 border border-blue-400">
            {dataCount}
          </span>
        )}
      </div>
    </header>
  );
}
