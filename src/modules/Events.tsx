"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Clock, LayoutGrid, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import EventModal from "../components/EventModal";
import HtmlContent from "../components/HtmlContent";
import { useLanguage } from "../components/LanguageContext";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeContext";
import Timeline from "../components/Timeline";
import {
  getEvents,
  getMediaUrl,
  renderBlocksToText,
} from "../services/supabase";
import { EventData, translations } from "../types";

export default function Events() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = translations[language];
  const isDark = theme === "dark";

  const [events, setEvents] = useState<EventData[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [view, setView] = useState<"grid" | "timeline">("grid");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      renderBlocksToText(event.content)
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const sortedEvents = [...filteredEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="min-h-screen bg-app text-body">
      <Navbar />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* ── Header ── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-2">
                {t.events.title}
              </h1>
              <p className="text-xl text-justify text-zinc-500 max-w-xl mx-auto">
                {t.events.timeline}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative w-full md:w-80"
            >
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                size={18}
              />
              <input
                type="text"
                placeholder={t.events.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-12 pr-4 py-3.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all text-sm bg-card border-subtle text-body`}
              />
            </motion.div>
          </div>

          {/* ── Toggle Vue ── */}
          <div className="flex items-center justify-between mb-10">
            <p
              className={`text-sm ${isDark ? "text-zinc-500" : "text-stone-400"}`}
            >
              {filteredEvents.length}{" "}
              {filteredEvents.length > 1
                ? t.events.resultsCountOther
                : t.events.resultsCountOne}
            </p>

            <div className="flex items-center p-1 rounded-2xl border bg-card border-subtle">
              <button
                onClick={() => setView("grid")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  view === "grid"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-muted hover:text-body"
                }`}
              >
                <LayoutGrid size={15} />
                <span className="hidden sm:inline">{t.events.viewGrid}</span>
              </button>
              <button
                onClick={() => setView("timeline")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  view === "timeline"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "text-muted hover:text-body"
                }`}
              >
                <Clock size={15} />
                <span className="hidden sm:inline">
                  {t.events.viewTimeline}
                </span>
              </button>
            </div>
          </div>

          {/* ── Contenu switchable ── */}
          <AnimatePresence mode="wait">
            {/* VUE GRILLE */}
            {view === "grid" && (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-[4/3] rounded-2xl animate-pulse bg-card`}
                      />
                    ))}
                  </div>
                ) : sortedEvents.length === 0 ? (
                  <p className={`text-center py-24 text-muted`}>
                    {t.events.emptyState}
                  </p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {sortedEvents.map((event, idx) => {
                      const imageUrl = getMediaUrl(event.cover_photo);
                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: idx * 0.07 }}
                          className={`group rounded-2xl overflow-hidden shadow-xl shadow-black/5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-2xl ${
                            isDark ? "bg-zinc-900" : "bg-white"
                          }`}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="relative aspect-video overflow-hidden">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={event.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                unoptimized={
                                  event.cover_photo?.startsWith("http") || false
                                }
                              />
                            ) : (
                              <div
                                className={`w-full h-full flex items-center justify-center ${isDark ? "bg-zinc-800" : "bg-stone-100"}`}
                              >
                                <Calendar className="w-12 h-12 text-zinc-400" />
                              </div>
                            )}
                            <div
                              className={`absolute top-3 left-3 px-2.5 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest backdrop-blur-md z-10 ${isDark ? "bg-black/60 text-zinc-200" : "bg-white/90 text-stone-700"}`}
                            >
                              {new Date(event.date).toLocaleDateString(
                                language === "fr" ? "fr-FR" : "en-US",
                                { year: "numeric", month: "long" },
                              )}
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="text-xl font-bold mb-3 group-hover:text-emerald-600 transition-colors leading-tight">
                              {event.title}
                            </h3>
                            <HtmlContent
                              html={event.content ?? ""}
                              className={`text-sm line-clamp-3 mb-5 leading-relaxed text-justify ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                            />
                            <button className="text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all">
                              {t.events.readMore} →
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* VUE TIMELINE */}
            {view === "timeline" && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
              >
                <Timeline
                  items={sortedEvents.map((event) => ({
                    id: event.id,
                    date: new Date(event.date).toLocaleDateString(
                      language === "fr" ? "fr-FR" : "en-US",
                      { year: "numeric", month: "long", day: "numeric" },
                    ),
                    title: event.title,
                    content: (
                      <div className="space-y-4">
                        {event.cover_photo && (
                          <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
                            <Image
                              src={getMediaUrl(event.cover_photo)}
                              alt={event.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className="object-cover"
                              unoptimized={event.cover_photo.startsWith("http")}
                            />
                          </div>
                        )}
                        <h4 className="text-xl font-bold">{event.title}</h4>
                        <HtmlContent
                          html={event.content ?? ""}
                          className={`text-sm leading-relaxed text-justify ${isDark ? "text-zinc-400" : "text-zinc-500"}`}
                        />
                        <button
                          onClick={() => setSelectedEvent(event)}
                          className="text-emerald-600 font-bold text-xs uppercase tracking-widest hover:underline"
                        >
                          {t.events.readMore}
                        </button>
                      </div>
                    ),
                  }))}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
}
