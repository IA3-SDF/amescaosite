"use client";

import { useEffect, useState } from "react";

/**
 * AGBanner — bannière flottante d'annonce pour l'Assemblée Générale AMESCAO
 *
 * Intégration dans src/modules/Home.tsx :
 *
 *   import AGBanner from "@/components/AGBanner";
 *   ...
 *   <AGBanner />
 *
 * Le composant se place lui-même en position fixe, centré en haut de l'écran.
 * Il se referme au clic sur le X et retient ce choix pour la session en cours
 * (sessionStorage), pour ne pas harceler un visiteur qui revient sur la page.
 */

const REGISTER_URL = "https://assemble-self-zeta.vercel.app/";
const DISMISS_KEY = "amescao-ag-banner-dismissed";

export default function AGBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const dismissed = typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY);
    if (!dismissed) {
      // léger délai pour laisser la page respirer avant l'entrée du banner
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
    <div className={`ag-wrap ${closing ? "ag-closing" : "ag-entering"}`}>
      <div className="ag-card">
        <button
          className="ag-close"
          onClick={handleClose}
          aria-label="Fermer la bannière"
          type="button"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="ag-badge">
          <span className="ag-badge-ring" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ag-badge-icon">
            <path
              d="M3 11v2a1 1 0 001 1h2l4 4V6L6 10H4a1 1 0 00-1 1z"
              fill="currentColor"
            />
            <path
              d="M15 8a4 4 0 010 8M18 5a8 8 0 010 14"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span>Convocation officielle</span>
        </div>

        <div className="ag-body">
          <p className="ag-headline">
            Le nouveau Bureau de l&apos;AMESCAO s&apos;élit le 29 août
          </p>
          <p className="ag-sub">
            Statuts, règlement intérieur, élections : chaque voix compte à Aouda.
            Confirme ta présence en une minute.
          </p>
        </div>

        <a
          className="ag-cta"
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Je m&apos;inscris</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ag-cta-arrow">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>

        <div className="ag-line" />
      </div>

      <style jsx>{`
        .ag-wrap {
          position: fixed;
          top: 18px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 60;
          width: min(92vw, 560px);
          pointer-events: none;
        }

        .ag-card {
          pointer-events: auto;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 18px 28px 20px;
          border-radius: 20px;
          background: linear-gradient(180deg, #ffffff 0%, #f4f7fe 100%);
          border: 1px solid rgba(20, 36, 92, 0.12);
          box-shadow:
            0 18px 40px -12px rgba(15, 27, 74, 0.35),
            0 0 0 1px rgba(232, 169, 61, 0.08);
          text-align: center;
          overflow: hidden;
        }

        .ag-close {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          border-radius: 999px;
          border: none;
          background: rgba(20, 36, 92, 0.06);
          color: #14245c;
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease, transform 0.15s ease;
        }
        .ag-close:hover {
          background: rgba(20, 36, 92, 0.12);
          transform: rotate(90deg);
        }

        .ag-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px 5px 10px;
          border-radius: 999px;
          background: rgba(20, 36, 92, 0.06);
          color: #14245c;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .ag-badge-icon {
          color: #e5a93b;
        }
        .ag-badge-ring {
          position: absolute;
          inset: -3px;
          border-radius: 999px;
          border: 1.5px solid rgba(229, 169, 59, 0.55);
          animation: ag-pulse 2.4s ease-out infinite;
        }

        .ag-body {
          max-width: 440px;
        }

        .ag-headline {
          margin: 2px 0 0;
          font-size: 18px;
          line-height: 1.28;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: #101a3d;
        }

        .ag-sub {
          margin: 6px 0 2px;
          font-size: 13px;
          line-height: 1.5;
          color: #4a5170;
          font-weight: 500;
        }

        .ag-cta {
          margin-top: 6px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 22px;
          border-radius: 999px;
          background: linear-gradient(135deg, #14245c 0%, #1b3a8c 100%);
          color: #ffffff;
          font-size: 13.5px;
          font-weight: 700;
          letter-spacing: 0.01em;
          text-decoration: none;
          box-shadow: 0 8px 20px -6px rgba(20, 36, 92, 0.55);
          transition: transform 0.18s ease, box-shadow 0.18s ease;
          animation: ag-glow 2.6s ease-in-out infinite;
        }
        .ag-cta:hover {
          transform: translateY(-1px) scale(1.02);
          box-shadow: 0 10px 26px -6px rgba(20, 36, 92, 0.65);
        }
        .ag-cta-arrow {
          transition: transform 0.18s ease;
        }
        .ag-cta:hover .ag-cta-arrow {
          transform: translateX(2px);
        }

        .ag-line {
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: linear-gradient(90deg, #e5a93b, #f5cd7e, #e5a93b);
          transform: translateX(-50%);
          animation: ag-line-grow 0.9s 0.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          border-radius: 3px;
        }

        @keyframes ag-pulse {
          0% {
            opacity: 0.9;
            transform: scale(1);
          }
          70% {
            opacity: 0;
            transform: scale(1.6);
          }
          100% {
            opacity: 0;
            transform: scale(1.6);
          }
        }

        @keyframes ag-glow {
          0%,
          100% {
            box-shadow: 0 8px 20px -6px rgba(20, 36, 92, 0.55);
          }
          50% {
            box-shadow: 0 8px 26px -4px rgba(229, 169, 59, 0.55);
          }
        }

        @keyframes ag-line-grow {
          to {
            width: 72%;
          }
        }

        .ag-entering {
          animation: ag-enter 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .ag-closing {
          animation: ag-exit 0.26s ease-in both;
        }

        @keyframes ag-enter {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
        }
        @keyframes ag-exit {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(-16px) scale(0.97);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ag-entering,
          .ag-closing,
          .ag-cta,
          .ag-badge-ring,
          .ag-line {
            animation: none !important;
          }
        }

        @media (max-width: 480px) {
          .ag-wrap {
            top: 10px;
            width: 94vw;
          }
          .ag-card {
            padding: 15px 18px 18px;
            border-radius: 16px;
          }
          .ag-headline {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
