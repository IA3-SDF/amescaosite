"use client";

import { AnimatePresence, motion } from "framer-motion";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import { useTheme } from "../components/ThemeContext";
import {
  getBoardMembers,
  getEvents,
  getMediaUrl,
  getReports,
} from "../services/supabase";
import {
  BoardMemberData,
  EventData,
  ReportData,
  Translation,
  translations,
} from "../types";

import {
  ArrowRight,
  Calendar,
  ChevronDown,
  Download,
  ExternalLink,
  FileText,
  Heart,
  Pointer,
  Users,
  X as XIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EventModal from "../components/EventModal";
import Footer from "../components/Footer";
import { HeroSection } from "../components/HeroSection";
import HtmlContent from "../components/HtmlContent";
import Navbar from "../components/Navbar";

interface SidebarContentProps {
  loading: boolean;
  boardMembers: BoardMemberData[];
  reports: ReportData[];
  expandedMember: string | null;
  setExpandedMember: Dispatch<SetStateAction<string | null>>;
  isDark: boolean;
  panelMaxHeight: string;
  t: Translation;
}

const SidebarContent = ({
  loading,
  boardMembers,
  reports,
  expandedMember,
  setExpandedMember,
  isDark,
  panelMaxHeight,
  t,
}: SidebarContentProps) => (
  <div className="flex flex-col gap-5">
    {/* ── Bloc Bureau ── */}
    <div className="rounded-3xl border overflow-hidden bg-card border-subtle shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-subtle">
        <Users size={14} className="text-emerald-600" />
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600">
          {t.home.boardTitle}
        </p>
      </div>

      {/* Liste — scroll si > 5 membres */}
      <div
        className={`${panelMaxHeight} overflow-y-auto py-2 px-2`}
        style={{ scrollbarWidth: "none" }}
      >
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className={`h-14 rounded-2xl mb-1.5 animate-pulse bg-card`}
            />
          ))
        ) : boardMembers.length === 0 ? (
          <p className={`text-center text-xs py-8 text-muted`}>
            {t.home.noMembers}
          </p>
        ) : (
          boardMembers.map((member, idx) => (
            <div key={member.id}>
              <motion.button
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() =>
                  setExpandedMember(
                    expandedMember === member.id ? null : member.id,
                  )
                }
                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all ${
                  expandedMember === member.id
                    ? isDark
                      ? "bg-emerald-950/60 ring-1 ring-emerald-700/40"
                      : "bg-emerald-50 ring-1 ring-emerald-200"
                    : "hover:bg-card/80"
                }`}
              >
                <div className="relative w-10 h-10 flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${
                      expandedMember === member.id
                        ? "ring-emerald-500"
                        : "ring-subtle"
                    }`}
                  >
                    {member.photo ? (
                      <Image
                        src={getMediaUrl(member.photo)}
                        alt={`${member.name} ${member.surname || ""}`}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        unoptimized={member.photo.startsWith("http")}
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center text-sm font-black ${
                          isDark
                            ? "bg-zinc-800 text-emerald-400"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {member.name?.[0]}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold truncate leading-tight ${isDark ? "text-zinc-100" : "text-stone-800"}`}
                  >
                    {member.name} {member.surname}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider truncate mt-0.5">
                    {member.role}
                  </p>
                </div>

                <ChevronDown
                  size={13}
                  className={`flex-shrink-0 transition-transform ${
                    expandedMember === member.id
                      ? "rotate-180 text-emerald-500"
                      : isDark
                        ? "text-zinc-600"
                        : "text-stone-300"
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {expandedMember === member.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden px-2"
                  >
                    <div
                      className={`py-2.5 px-3 rounded-xl text-xs leading-relaxed mb-1 ${
                        isDark
                          ? "bg-zinc-800/50 text-zinc-400"
                          : "bg-stone-100 text-stone-500"
                      }`}
                    >
                      {member.biography || t.home.noBiography}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>

    <div
      className={`rounded-3xl border overflow-hidden ${
        isDark
          ? "bg-zinc-900 border-zinc-800"
          : "bg-white border-stone-200 shadow-sm"
      }`}
    >
      <div
        className={`flex items-center gap-2 px-5 py-4 border-b ${isDark ? "border-zinc-800" : "border-stone-100"}`}
      >
        <FileText size={14} className="text-emerald-600" />
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600">
          {t.home.reportsTitle}
        </p>
      </div>

      <div
        className={`${panelMaxHeight} overflow-y-auto py-2 px-2`}
        style={{ scrollbarWidth: "none" }}
      >
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`h-20 rounded-2xl mb-1.5 animate-pulse ${isDark ? "bg-zinc-800" : "bg-stone-100"}`}
            />
          ))
        ) : reports.length === 0 ? (
          <p className={`text-center text-xs py-8 text-muted`}>
            {t.home.noReports}
          </p>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="px-3 py-3 border-b border-subtle last:border-none"
            >
              <div className="flex gap-2.5 items-start">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isDark
                      ? "bg-emerald-950 text-emerald-400"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  <FileText size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold leading-snug mb-1 ${isDark ? "text-zinc-100" : "text-stone-800"}`}
                  >
                    {report.title}
                  </p>
                  {report.year && (
                    <p
                      className={`text-[10px] mb-2 ${isDark ? "text-zinc-500" : "text-stone-400"}`}
                    >
                      {new Date(report.year).getFullYear()}
                    </p>
                  )}
                  <div className="flex gap-1.5">
                    {report.content && (
                      <a
                        href={getMediaUrl(report.content)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold hover:bg-emerald-500 transition-colors"
                      >
                        <ExternalLink size={9} className="text-white" /> Lire
                      </a>
                    )}
                    {report.document_pdf_link && (
                      <a
                        href={getMediaUrl(report.document_pdf_link)}
                        download
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                          isDark
                            ? "bg-emerald-950 text-emerald-300 hover:bg-emerald-900"
                            : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                        }`}
                      >
                        <Download
                          size={9}
                          className={
                            isDark ? "text-emerald-300" : "text-emerald-700"
                          }
                        />{" "}
                        PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

export default function Home() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = translations[language];

  const [events, setEvents] = useState<EventData[]>([]);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMemberData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, reportsData, boardData] = await Promise.all([
          getEvents(),
          getReports(),
          getBoardMembers(),
        ]);

        // Les données sont déjà triées par le service Supabase
        setEvents(eventsData);
        setReports(reportsData);
        setBoardMembers(boardData);
      } catch (error) {
        console.error("Error fetching data from Supabase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fermer la sidebar mobile quand on clique en dehors
  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showMobileSidebar]);

  // hauteur max ~5 items : 5 × 64px + padding
  const PANEL_MAX_H = "max-h-[340px]";

  return (
    <div className="bg-app text-body">
      <Navbar />

      {/* ══════════════════════════════════════════════════════════════
          HERO SECTION
          ══════════════════════════════════════════════════════════════ */}
      <HeroSection t={t} />

      {/* ══════════════════════════════════════════════════════════════
          STATS BAND - Responsive avec scroll horizontal sur mobile
          ══════════════════════════════════════════════════════════════ */}
      <section className="py-6 md:py-10 px-4 md:px-8 border-y bg-app border-subtle">
        <div className="flex flex-wrap justify-center md:justify-start gap-8 md:gap-16 max-w-6xl mx-auto">
          {[
            ["10+", t.home.statsAnnualActions],
            ["500+", t.home.statsYoungSupported],
            ["25+", t.home.statsYearsImpact],
          ].map(([val, label]) => (
            <div key={label} className="text-center md:text-left">
              <p className="text-2xl md:text-3xl font-bold text-emerald-600 tracking-tight">
                {val}
              </p>
              <p className="text-[10px] uppercase tracking-widest mt-1 text-muted">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          BOUTON MOBILE POUR OUVRIR LA SIDEBAR (visible uniquement sur mobile)
          ══════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden sticky top-[calc(4rem+0.5rem)] z-40 px-4 py-2 mx-auto max-w-[240px] w-full">
        <button
          onClick={() => setShowMobileSidebar(true)}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs transition-all shadow-md active:scale-95 ${
            isDark
              ? "bg-emerald-900/80 hover:bg-emerald-900 text-emerald-100 border border-emerald-700/50"
              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
          }`}
        >
          <Pointer size={16} className="animate-pulse -rotate-12" />
          {t.home.sidebarButton}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          SIDEBAR MOBILE - Overlay avec slide-in depuis la gauche
          ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 left-0 h-full w-[85vw] max-w-[340px] z-50 overflow-y-auto lg:hidden bg-app`}
              style={{ scrollbarWidth: "none" }}
            >
              {/* Header avec bouton fermer */}
              <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 border-b bg-app border-subtle">
                <h3 className="font-bold text-lg">{t.home.sidebarTitle}</h3>
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className={`p-2 rounded-xl transition-colors ${
                    isDark ? "hover:bg-zinc-800" : "hover:bg-stone-100"
                  }`}
                >
                  <XIcon size={20} />
                </button>
              </div>

              {/* Contenu de la sidebar */}
              <div className="p-4">
                <SidebarContent
                  loading={loading}
                  boardMembers={boardMembers}
                  reports={reports}
                  expandedMember={expandedMember}
                  setExpandedMember={setExpandedMember}
                  isDark={isDark}
                  panelMaxHeight={PANEL_MAX_H}
                  t={t}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          MAIN LAYOUT : sidebar gauche sticky (desktop) + contenu droite
          ══════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
        {/* ════════════════════════════════════════════════════════
            SIDEBAR GAUCHE — sticky (visible uniquement sur desktop)
        ════════════════════════════════════════════════════════ */}
        <aside className="hidden lg:block w-[300px] flex-shrink-0 sticky top-6">
          <SidebarContent
            loading={loading}
            boardMembers={boardMembers}
            reports={reports}
            expandedMember={expandedMember}
            setExpandedMember={setExpandedMember}
            isDark={isDark}
            panelMaxHeight={PANEL_MAX_H}
            t={t}
          />
        </aside>

        {/* ════════════════════════════════════════════════════════
            CONTENU PRINCIPAL (droite)
        ════════════════════════════════════════════════════════ */}
        <div className="flex-1 min-w-0 space-y-12 md:space-y-16">
          {/* ══════════════════════════════════════════════════════
              SECTION PRÉSENTATION
              ══════════════════════════════════════════════════════ */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="order-2 md:order-1"
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight">
                  {t.home.presentationTitle}
                </h2>
                <p
                  className={`text-base md:text-lg leading-relaxed mb-6 md:mb-8 text-justify ${
                    isDark ? "text-zinc-400" : "text-zinc-500"
                  }`}
                >
                  {t.home.presentationText}
                </p>
                <div className="grid grid-cols-2 gap-6 md:gap-8">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">
                      10+
                    </div>
                    <div className="text-xs md:text-sm uppercase tracking-widest opacity-60">
                      Actions Annuelles
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-emerald-600 mb-1">
                      500+
                    </div>
                    <div className="text-xs md:text-sm uppercase tracking-widest opacity-60">
                      Jeunes Soutenus
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl order-1 md:order-2"
              >
                <Image
                  src={getMediaUrl(
                    "ImagesStatics/aef5b2cb-bfb5-41f2-9100-73fd71fe98e8.jpg",
                  )}
                  alt="Impact"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              SECTION ÉVÉNEMENTS
              ══════════════════════════════════════════════════════ */}
          <section>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 md:mb-8 gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">
                  {t.home.newsTitle}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  {t.home.recentEvents}
                </h2>
              </div>
              <a
                href="/events"
                className="text-emerald-600 hover:text-emerald-500 font-medium flex items-center gap-2 transition-colors text-sm whitespace-nowrap"
              >
                Voir tout <ArrowRight size={16} />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {loading
                ? [...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`aspect-[4/3] rounded-3xl animate-pulse ${
                        isDark ? "bg-zinc-800" : "bg-stone-200"
                      }`}
                    />
                  ))
                : events.slice(0, 3).map((event, idx) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.08 }}
                      className={`group cursor-pointer rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 ${
                        isDark ? "bg-zinc-900" : "bg-white"
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      {/* Image principale */}
                      <div className="relative w-full aspect-[4/3] overflow-hidden">
                        {event.cover_photo ? (
                          <Image
                            src={getMediaUrl(event.cover_photo)}
                            alt={event.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            unoptimized={event.cover_photo.startsWith("http")}
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center ${
                              isDark ? "bg-zinc-800" : "bg-stone-100"
                            }`}
                          >
                            <Calendar
                              className={
                                isDark ? "text-zinc-600" : "text-stone-400"
                              }
                              size={48}
                            />
                          </div>
                        )}
                        {/* Date badge */}
                        <div
                          className={`absolute top-3 left-3 px-2.5 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest backdrop-blur-md z-10 ${
                            isDark
                              ? "bg-black/60 text-zinc-200"
                              : "bg-white/90 text-stone-700"
                          }`}
                        >
                          {new Date(event.date).toLocaleDateString(
                            language === "fr" ? "fr-FR" : "en-US",
                            { year: "numeric", month: "long" },
                          )}
                        </div>
                      </div>

                      {/* Contenu texte */}
                      <div className="p-4 md:p-5">
                        <h3
                          className={`text-base md:text-lg font-black mb-2 leading-tight group-hover:text-emerald-600 transition-colors ${
                            isDark ? "text-zinc-100" : "text-stone-900"
                          }`}
                        >
                          {event.title}
                        </h3>
                        <HtmlContent
                          html={event.content ?? ""}
                          className={`text-sm leading-relaxed line-clamp-3 mb-4 ${
                            isDark ? "text-zinc-400" : "text-stone-500"
                          }`}
                        />
                        <button className="flex items-center gap-2 px-3.5 md:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-900/20">
                          <ExternalLink size={12} /> {t.home.read}
                        </button>
                      </div>
                    </motion.div>
                  ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════
              SECTION À PROPOS
              ══════════════════════════════════════════════════════ */}
          <section className="py-8 md:py-10 text-center px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight">
              {t.about.title}
            </h2>
            <p
              className={`text-base md:text-xl text-justify md:text-center mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {t.about.text}
            </p>
          </section>

          {/* ══════════════════════════════════════════════════════
              SECTION SUPPORT/DON
              ══════════════════════════════════════════════════════ */}
          <section className="text-center px-4 pb-8 md:pb-0">
            <Heart
              className="mx-auto text-emerald-600 mb-4 md:mb-6"
              size={40}
            />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 tracking-tight">
              {t.support.title}
            </h2>
            <p
              className={`text-base md:text-xl mb-8 md:mb-10 leading-relaxed max-w-xl mx-auto ${
                isDark ? "text-zinc-400" : "text-zinc-500"
              }`}
            >
              {t.support.motivation}
            </p>
            <Link href="/support" className="w-full sm:w-auto">
              <button className="w-full px-8 md:px-10 py-4 md:py-5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-full font-bold text-base md:text-lg transition-all duration-200 shadow-xl shadow-emerald-900/20 mb-[env(safe-area-inset-bottom)]">
                {t.support.donateButton}
              </button>
            </Link>
          </section>
        </div>
      </div>
      <Footer />

      {/* ══════════════════════════════════════════════════════════════
          EVENT MODAL
          ══════════════════════════════════════════════════════════════ */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
