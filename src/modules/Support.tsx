"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLanguage } from "../components/LanguageContext";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeContext";

export default function Support() {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen bg-app text-main`}>
      <Navbar />

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div
          className={`absolute inset-0 blur-3xl opacity-30 
          ${
            isDark
              ? "bg-gradient-to-br from-emerald-500 via-transparent to-blue-500"
              : "bg-gradient-to-br from-emerald-300 via-transparent to-blue-300"
          }`}
        />

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
        >
          {t.support.title}
        </motion.h1>

        <p
          className={`max-w-xl mx-auto text-lg ${isDark ? "text-zinc-400" : "text-zinc-600"}`}
        >
          {t.support.motivation}
        </p>
      </section>

      {/* MOBILE MONEY */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-semibold mb-10">
          {t.support.mobileMoneyTitle}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* CARTE 1: MIX BY YAS */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative h-[450px] flex flex-col rounded-3xl overflow-hidden border shadow-xl
        card border-subtle`}
          >
            {/* Image: 2/3 */}
            <div className="relative h-2/3 w-full p-8">
              <Image
                src="https://xucxrnwuxwdwfqvfhlib.supabase.co/storage/v1/object/public/amescao/ImagesStatics/YAS.png"
                alt="Mixx by Yas"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            {/* Texte: 1/3 */}
            <div className="h-1/3 p-6 flex flex-col justify-center text-center z-10">
              <div
                className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}
              >
                Mixx by Yas
              </div>
              <div className="text-emerald-600 dark:text-emerald-400 text-2xl font-black tracking-wider">
                +228 71 28 08 08
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
          </motion.div>

          {/* CARTE 2: FLOOZ */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={`relative h-[450px] flex flex-col rounded-3xl overflow-hidden border shadow-xl
        card border-subtle`}
          >
            {/* Image: 2/3 */}
            <div className="relative h-2/3 w-full p-8">
              <Image
                src="https://xucxrnwuxwdwfqvfhlib.supabase.co/storage/v1/object/public/amescao/ImagesStatics/flooz.png"
                alt="Flooz"
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            {/* Texte: 1/3 */}
            <div className="h-1/3 p-6 flex flex-col justify-center text-center z-10">
              <div
                className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-zinc-900"}`}
              >
                Flooz
              </div>
              <div className="text-orange-500 dark:text-orange-400 text-2xl font-black tracking-wider">
                +228 97 78 94 51
              </div>
            </div>

            {/* Glow effect */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full"></div>
          </motion.div>
        </div>
      </section>

      {/* VISA PREMIUM */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 tracking-tight">
          {t.support.paymentTitle}
        </h2>

        <div className="flex justify-center italic">
          <motion.div
            whileHover={{ scale: 1.05, rotateY: 5, rotateX: -5 }}
            transition={{ type: "spring", stiffness: 150 }}
            className="relative w-full max-w-md h-64 rounded-[2rem] overflow-hidden shadow-2xl perspective-1000"
          >
            {/* Fond Dynamique : Sombre/Mystérieux en Dark mode, Éclatant en Light mode */}
            <div
              className={`absolute inset-0 bg-gradient-to-br transition-colors duration-700 ${
                isDark
                  ? "from-zinc-900 via-slate-800 to-black"
                  : "from-indigo-600 via-blue-700 to-violet-800"
              }`}
            />

            {/* Grain/Texture subtile pour le réalisme */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app')] mix-blend-overlay"></div>

            {/* Reflet de lumière (Glass effect) */}
            <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.15)_0%,transparent_60%)] pointer-events-none" />

            {/* Bordure interne pour l'effet d'épaisseur (Bezel) */}
            <div className="absolute inset-0 border border-white/20 rounded-[2rem] z-10" />

            {/* Contenu de la carte */}
            <div className="relative p-8 h-full flex flex-col justify-between text-white z-20">
              {/* Top: Logo & Chip */}
              <div className="flex justify-between items-start">
                <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-md opacity-80 shadow-inner overflow-hidden flex items-center justify-center">
                  {/* Simule une puce électronique */}
                  <div className="grid grid-cols-2 gap-1 opacity-40">
                    <div className="w-4 h-3 border border-black/20"></div>
                    <div className="w-4 h-3 border border-black/20"></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black italic tracking-tighter italic">
                    VISA
                  </span>
                  <p className="text-[8px] uppercase tracking-[0.2em] opacity-60 leading-none">
                    Platinum
                  </p>
                </div>
              </div>

              {/* Middle: Number */}
              <div className="text-2xl md:text-3xl tracking-[0.15em] font-mono drop-shadow-lg py-4">
                •••• •••• •••• 5566
              </div>

              {/* Bottom: Info */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">
                    {t.support.holderLabel}
                  </p>
                  <p className="text-sm font-semibold tracking-wide uppercase">
                    Amicale de l&apos;Eneam
                  </p>
                </div>

                <div className="text-right space-y-1">
                  <p className="text-[10px] uppercase tracking-widest opacity-50 font-bold">
                    {t.support.expiresLabel}
                  </p>
                  <p className="text-sm font-semibold">08 / 30</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bouton de paiement ultra-moderne */}
        <div className="mt-12 text-center">
          <button
            className={`group relative px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl overflow-hidden
      ${isDark ? "bg-white text-black" : "bg-zinc-900 text-white hover:bg-black"}`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {t.support.donateButton}
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
