"use client";

import { ReactNode } from "react";
import Footer from "../../src/components/Footer";
import { MobileBottomNav } from "../../src/components/MobileBottomNav";
import Navbar from "../../src/components/Navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-[calc(96px+env(safe-area-inset-bottom))] lg:pb-0">
        {children}
      </main>
      <Footer className="hidden lg:block" />
      <MobileBottomNav />
    </div>
  );
}
