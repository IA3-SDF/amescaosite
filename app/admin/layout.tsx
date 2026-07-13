// layout.tsx
"use client";

import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  // La vérification admin est entièrement gérée par AdminGuard dans page.tsx
  // Ce layout sert uniquement de wrapper pour les pages admin

  return <div className="admin-layout">{children}</div>;
}
