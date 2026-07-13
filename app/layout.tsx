import CookieBanner from "@/src/components/CookieBanner";
import { IOSPWAOptimizer } from "@/src/components/IOSPWAOptimizer";
import { PWAInstaller } from "@/src/components/PWAInstaller";
import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

// Gère le viewport et la couleur de la barre système (Android/iOS) de façon native
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#10b981" },
    { media: "(prefers-color-scheme: dark)", color: "#047857" },
  ],
};

// Centralise l'ensemble des métadonnées SEO et PWA Premium
export const metadata: Metadata = {
  title:
    "AM.E.S.C.A.O - Amicale des Elèves Etudiants et Stagiaires du canton d'Aouda",
  description: "Soutenir l'éducation et l'avenir de la jeunesse d'Aouda, Togo.",
  manifest: "/manifest.json",

  // Configuration des icônes (Favicon + Apple Touch Icon)
  icons: {
    icon: "/public/icon-192.png",
    shortcut: "/public/icon-192.png",
    apple: "/public/icon-512.png", // Génère le <link rel="apple-touch-icon"> demandé
  },

  // Configuration PWA pour iOS
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },

  openGraph: {
    title: "AM.E.S.C.A.O",
    description:
      "Soutenir l'éducation et l'avenir de la jeunesse d'Aouda, Togo.",
    url: "https://amescao.com",
    siteName: "AM.E.S.C.A.O",
    images: [
      {
        url: "https://xucxrnwuxwdwfqvfhlib.supabase.co/storage/v1/object/public/amescao/1779531259592-3453inj3.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      {/* 
        Le <head> reste vide ici car Next.js y injecte automatiquement 
        les objets 'viewport' et 'metadata' définis ci-dessus.
      */}
      <head />
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased`}
      >
        <Providers>
          <IOSPWAOptimizer />
          {children}
          <CookieBanner />
          <PWAInstaller />
        </Providers>
      </body>
    </html>
  );
}
