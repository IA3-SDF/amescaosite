"use client";

import React from "react";
import { LanguageProvider } from "../src/components/LanguageContext";
import { ThemeProvider } from "../src/components/ThemeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>{children}</LanguageProvider>
    </ThemeProvider>
  );
}
