"use client";
{/* finissions*/}
import { useEffect, useState } from "react";

const REGISTER_URL = "https://assemble-self-zeta.vercel.app/";
const DISMISS_KEY = "amescao-ag-banner-dismissed";

export default function AGBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
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
      className={`fixed top-[24px] left-1/2 z-50 w-[min(94vw,540px)] pointer-events-none transition-all duration-300 ${
        closing 
          ? "opacity-0 -translate-x-1/2 -translate-y-4 scale-95 pointer-events-none" 
          : "animate-[agGlassEnter_0.6s_cubic-bezier(0.16,1,0.3,1)_both]"
      }`}
    >
      {/* Conteneur principal avec effet Glassmorphism et flou d'arrière-plan */}
      <div className="pointer-events-auto relative flex flex-col items-center gap-3 px-6 sm:px-10 pt-6 pb-6 rounded-[24px] bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_20px_40px_-15px_rgba(20,36,92,0.15)] text-center overflow-hidden">
        
        {/* Bouton Fermer discret */}
        <button
          className="absolute top-3 right-3 w-7 h-7 grid place-items-center rounded-full bg-[#14245c]/5 text-[#14245c]/60 hover:text-[#14245c] hover:bg-[#14245c]/10 transition-colors duration-200"
          onClick={handleClose}
          aria-label="Fermer la bannière"
          type="button"
        >
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Badge Officiel — Pulsation Forte Corrigée */}
        <div className="relative inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#14245c]/8 text-[#14245c] text-[10.5px] font-extrabold tracking-widest uppercase font-sans">
          {/* Cercle externe de pulsation accentué (Onde de choc) */}
          <span className="absolute inset-0 rounded-full border-2 border-[#e5a93b] animate-[agStrongPulse_2s_cubic-bezier(0.25,0,0,1)_infinite]" />
          
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#e5a93b] z-10">
            <path d="M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1z" fill="currentColor" />
            <path d="M15 8a4 4 0 010 8M18 5a8 8 0 010 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
          <span className="z-10">Convocation officielle</span>
        </div>

        {/* Textes parfaitement contrastés */}
        <div className="max-w-[440px] font-sans">
          <h2 className="m-0 text-lg sm:text-[19px] leading-snug font-extrabold tracking-tight text-[#14245c]">
            AG Ordinaire statutaire et élective le samedi 29 août 2026
          </h2>
          <p className="mt-2 mb-1 text-[13.5px] leading-relaxed text-[#4a5170] font-medium">
            Le Bureau Exécutif convie tous les membres à Aouda pour réviser nos textes et élire la nouvelle équipe.
            <span className="block mt-1 text-[#1b3a8c] font-bold text-[12.5px] tracking-wide">
              🎯 Unis aujourd&apos;hui, bâtissons demain
            </span>
          </p>
        </div>

        {/* Bouton Blanc Épuré */}
        <a
          className="group mt-1.5 inline-flex items-center gap-2 px-8 py-2.5 rounded-full bg-white border border-[#14245c]/20 text-[#14245c] text-[13.5px] font-extrabold uppercase tracking-wider shadow-[0_4px_12px_rgba(20,36,92,0.08)] hover:shadow-[0_6px_20px_rgba(20,36,92,0.15)] hover:border-[#14245c]/40 hover:-translate-y-[1px] transition-all duration-300 animate-[agSoftGlow_3s_ease-in-out_infinite]"
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-[#14245c] block font-sans tracking-widest antialiased select-none">
            Je m&apos;inscris
          </span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-[#14245c] transform group-hover:translate-x-1 transition-transform duration-300">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        {/* Fine ligne de fond stylisée */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-gradient-to-r from-[#e5a93b]/20 via-[#e5a93b] to-[#e5a93b]/20 rounded-t-full animate-[agLineGrow_1s_0.4s_ease-out_forwards]" />
      </div>

      {/* Styles des animations */}
      <style jsx global>{`
        @keyframes agGlassEnter {
          from { 
            opacity: 0; 
            backdrop-filter: blur(0px);
            transform: translate(-50%, -16px) scale(0.97); 
          }
          to { 
            opacity: 1; 
            backdrop-filter: blur(12px);
            transform: translate(-50%, 0) scale(1); 
          }
        }
        /* Nouvelle animation de pulsation renforcée et plus visible */
        @keyframes agStrongPulse {
          0% { 
            opacity: 1; 
            transform: scale(1);
            border-color: rgba(229, 169, 59, 1);
          }
          60% {
            opacity: 0.4;
            border-color: rgba(229, 169, 59, 0.7);
          }
          100% { 
            opacity: 0; 
            transform: scale(1.45); 
            border-color: rgba(229, 169, 59, 0);
          }
        }
        @keyframes agSoftGlow {
          0%, 100% { box-shadow: 0 4px 12px rgba(20, 36, 92, 0.08); }
          50% { box-shadow: 0 4px 20px rgba(229, 169, 59, 0.2); }
        }
        @keyframes agLineGrow {
          from { width: 0%; }
          to { width: 60%; }
        }
      `}</style>
    </div>
  );
}
