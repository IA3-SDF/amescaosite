"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeroTranslations {
  home: {
    heroSubtitle: string;
  };
  support: {
    donateButton: string;
  };
}

export function HeroSection({ t }: { t: HeroTranslations }) {
  return (
    <section className="relative h-[90vh] pt-16 flex items-center justify-center overflow-hidden bg-app">
      {/* IMAGE calée pile sous la navbar (top-16) et hauteur adaptée */}
      <div className="absolute top-16 bottom-0 inset-x-0 h-[calc(100%-4rem)] z-0">
        <motion.div
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative w-full h-full"
        >
          <Image
            src="/photoPRINCIPALE.jpg"
            alt="Aouda"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
        </motion.div>

        {/* Dégradé centré — assombrit légèrement sans tuer l'image */}
        <div className="absolute inset-0 bg-black/40 z-10" />
        {/* Fondu bas vers la couleur de fond de page */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
      </div>

      {/* CONTENU centré */}
      <div className="relative z-20 px-6 w-full max-w-5xl mx-auto text-center">
        {/* AMESCAO — révélation lettre par lettre */}
        <div
          className="flex justify-center leading-none mb-5"
          aria-label="AMESCAO"
          style={{ fontFamily: "'Bebas Neue', sans-serif", overflow: "hidden" }}
        >
          {"AMESCAO".split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ y: "105%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.65,
                delay: 0.25 + i * 0.075,
                ease: [0.33, 1, 0.68, 1],
              }}
              className="inline-block text-white leading-none"
              style={{
                fontSize: "clamp(4.5rem, 12vw, 9.5rem)",
                textShadow:
                  "0 6px 32px rgba(0,0,0,0.55), 0 2px 6px rgba(0,0,0,0.9)",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* heroTitle — tagline en vert */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="text-emerald-400 text-xs md:text-sm font-bold uppercase tracking-[0.4em] mb-5"
        >
          Amicale des élèves étudiants et stagiaires du canton d&apos;Aouda
        </motion.p>

        {/* Sous-titre */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.25, duration: 0.8 }}
          className="text-white text-base md:text-xl font-light leading-relaxed max-w-xl mx-auto mb-10 drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]"
        >
          {t.home.heroSubtitle}
        </motion.p>

        {/* Bouton */}
        <Link href="/support" className="w-full sm:w-auto">
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 px-9 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold transition-colors shadow-xl shadow-emerald-900/30 mx-auto"
          >
            {t.support.donateButton}
            <ArrowRight size={20} />
          </motion.button>
        </Link>
      </div>

      {/* Indicateur scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent"
        />
        <span className="text-[9px] text-white/25 uppercase tracking-[0.25em]">
          scroll
        </span>
      </motion.div>
    </section>
  );
}
