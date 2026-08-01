"use client";

import { useEffect, useState } from "react";

const REGISTER_URL = "https://assemble-self-zeta.vercel.app/";
const DISMISS_KEY = "amescao-ag-banner-dismissed";

export default function AGBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      // Léger délai d'apparition pour fluidifier l'expérience utilisateur
      const t = setTimeout(() => setVisible(true), 350);
      return () => clearTimeout(t);
    }
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(DISMISS_KEY, "1");
    }, 260);
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-[18px] left-1/2 z-[60] w-[min(92vw,560px)] -translate-x-1/2 pointer-events-none transition-all duration-300 ${
        closing 
          ? "opacity-0 translate-y-[-10px] scale-95 pointer-events-none" 
          : "animate-[agEnter_0.55s_cubic-bezier(0.22,1,0.36,1)_both]"
      }`}
    >
      <div className="pointer-events-auto relative flex flex-col items-center gap-[10px] px-7 pt-[18px] pb-5 rounded-[20px] bg-gradient-to-b from-white to-[#f4f7fe] border border-[#14245c]/12 shadow-[0_18px_40px_-12px_rgba(15,27,74,0.35)] text-center overflow-hidden">
        
        {/* Bouton Fermer */}
        <button
          className="absolute top-2.5 right-2.5 w-6 h-6 grid place-items-center rounded-full bg-[#14245c]/5 text-[#14245c] hover:bg-[#14245c]/10 hover:rotate-90 transition-all duration-200"
          onClick={handleClose}
          aria-label="Fermer la bannière"
          type="button"
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Badge Officiel */}
        <div className="relative inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14245c]/5 text-[#14245c] text-[11px] font-bold tracking-wider uppercase">
          {/* Cercle d'animation Pulse */}
          <span className="absolute inset-[-3px] rounded-full border-[1.5px] border-[#e5a93b]/55 animate-[agPulse_2.4s_ease-out_infinite]" />
          
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#e5a93b]">
            <path d="M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1z" fill="currentColor" />
            <path d="M15 8a4 4 0 010 8M18 5a8 8 0 010 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
          <span>Convocation officielle</span>
        </div>

        {/* Bloc Contenu Textuel */}
        <div className="max-w-[440px]">
          <h2 className="m-0 mt-0.5 text-lg sm:text-[19px] leading-snug font-extrabold tracking-tight text-[#101a3d]">
            AG Ordinaire statutaire et élective le samedi 29 août 2026
          </h2>
          <p className="mt-2 mb-0.5 text-[13px] leading-relaxed text-[#4a5170] font-medium">
            Le Bureau Exécutif convie tous les membres à Aouda pour réviser nos textes et élire la nouvelle équipe.
            <span className="block mt-1 text-[#14245c] font-semibold">
              🎯 Unis aujourd&apos;hui, bâtissons demain : confirmez votre présence en un clic !
            </span>
          </p>
        </div>

        {/* Bouton d'action principal (CTA) */}
        <a
          className="group mt-1.5 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#14245c] to-[#1b3a8c] text-white text-[13.5px] font-bold tracking-wide shadow-[0_8px_20px_-6px_rgba(20,36,92,0.55)] hover:shadow-[0_10px_26px_-6px_rgba(20,36,92,0.65)] hover:-translate-y-[1px] hover:scale-[1.02] transition-all duration-200 animate-[agGlow_2.6s_ease-in-out_infinite]"
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Je m&apos;inscris</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="transform group-hover:translate-x-0.5 transition-transform duration-200">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Ligne décorative animée en bas de carte */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-gradient-to-r from-[#e5a93b] via-[#f5cd7e] to-[#e5a93b] rounded-t-full animate-[agLineGrow_0.9s_0.35s_cubic-bezier(0.22,1,0.36,1)_forwards]" />
      </div>

      {/* Ajout des animations CSS personnalisées non-standard de Tailwind */}
      <style jsx global>{`
        @keyframes agEnter {
          from { opacity: 0; transform: translate(-50%, -20px) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, 0) scale(1); }
        }
        @keyframes agPulse {
          0% { opacity: 0.9; transform: scale(1); }
          70%, 100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes agGlow {
          0%, 100% { box-shadow: 0 8px 20px -6px rgba(20, 36, 92, 0.55); }
          50% { box-shadow: 0 8px 26px -4px rgba(229, 169, 59, 0.45); }
        }
        @keyframes agLineGrow {
          from { width: 0%; }
          to { width: 75%; }
        }
      `}</style>
    </div>
  );
}
