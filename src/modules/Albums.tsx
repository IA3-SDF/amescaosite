"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Grid,
  Image as ImageIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "../components/LanguageContext";
import Navbar from "../components/Navbar";
import { useTheme } from "../components/ThemeContext";
import { getAlbums, getMediaUrl } from "../services/supabase";
import { AlbumData, translations } from "../types";

interface AlbumSection {
  id: string;
  title: string;
  year: string;
  date: string;
  photos: string[];
}

function PhotoViewer({
  photos,
  startIndex,
  albumTitle,
  albumYear,
  onClose,
}: {
  photos: string[];
  startIndex: number;
  albumTitle: string;
  albumYear: string;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const { language } = useLanguage();
  const t = translations[language];

  const prev = React.useCallback(
    () => setIdx((i) => (i - 1 + photos.length) % photos.length),
    [photos.length],
  );
  const next = React.useCallback(
    () => setIdx((i) => (i + 1) % photos.length),
    [photos.length],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200]"
    >
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        className="absolute inset-0 z-30 flex flex-col"
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.12}
        dragMomentum={false}
        onDragEnd={(event, info) => {
          if (info.offset.y > 120 || info.velocity.y > 750) {
            onClose();
          }
        }}
        whileDrag={{ scale: 0.985 }}
        style={{ touchAction: "pan-y" }}
      >
        <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-3 px-4 py-3 bg-black/40 backdrop-blur-xl">
          <button
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/20"
            aria-label={t.events.close}
          >
            <X size={18} />
          </button>

          <div className="min-w-0 flex-1 px-2 text-left">
            <p className="truncate text-sm font-semibold uppercase tracking-[0.18em] text-white">
              {albumTitle}
            </p>
            <div className="mt-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-slate-300">
              <span>{albumYear}</span>
              <span>•</span>
              <span>
                {idx + 1}/{photos.length}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-200">
            <Calendar size={14} className="text-slate-300" />
            <span>{t.events.close}</span>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-4 pb-28 pt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.25 }}
              className="relative w-full h-full max-h-[calc(100vh-120px)]"
            >
              <Image
                src={getMediaUrl(photos[idx])}
                alt={`${albumTitle} - photo ${idx + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority
                unoptimized={photos[idx]?.startsWith("http") || false}
              />
            </motion.div>
          </AnimatePresence>

          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-md transition hover:bg-white/20"
                aria-label="Photo précédente"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white shadow-lg backdrop-blur-md transition hover:bg-white/20"
                aria-label="Photo suivante"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 pb-4">
          <div className="mx-auto flex max-w-full gap-2 overflow-x-auto px-4 scrollbar-hide">
            {photos.map((p, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`relative h-14 w-14 rounded-3xl overflow-hidden flex-shrink-0 transition-all ${
                  i === idx
                    ? "ring-2 ring-emerald-400 opacity-100"
                    : "opacity-40 hover:opacity-80"
                }`}
                aria-label={`Voir la photo ${i + 1}`}
              >
                <Image
                  src={getMediaUrl(p)}
                  alt={`Miniature ${i + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized={p?.startsWith("http") || false}
                />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Albums() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const t = translations[language];
  const isDark = theme === "dark";

  const [albums, setAlbums] = useState<AlbumData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewer, setViewer] = useState<{
    photos: string[];
    startIndex: number;
    title: string;
    year: string;
  } | null>(null);

  const [activeYear, setActiveYear] = useState<string>("");
  const albumRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const [pinTop, setPinTop] = useState(0);
  const [pinProgress, setPinProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAlbums();
        setAlbums(data);
      } catch (error) {
        console.error("Error fetching albums:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const albumSections: AlbumSection[] = React.useMemo(() => {
    return albums
      .map((album) => ({
        id: album.id,
        title: album.event_title || t.albums.noTitle,
        year: album.event_date
          ? new Date(album.event_date).getFullYear().toString()
          : t.albums.unknownDate,
        date: album.event_date || "",
        photos: album.photos || [],
      }))
      .sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
      });
  }, [albums, t.albums.noTitle, t.albums.unknownDate]);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    const onScroll = () => {
      const containerHeight = container.scrollHeight;
      const scrolled =
        window.scrollY - container.offsetTop + window.innerHeight / 2;
      const progress = Math.min(Math.max(scrolled / containerHeight, 0), 1);
      setPinProgress(progress);

      let foundYear = albumSections[0]?.year ?? "";
      for (const album of albumSections) {
        const el = albumRefs.current[album.id];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) foundYear = album.year;
      }
      setActiveYear(foundYear);

      const foundAlbum = albumSections.find((a) => a.year === foundYear);
      if (foundAlbum) {
        const el = albumRefs.current[foundAlbum.id];
        if (el && container) {
          const elTop =
            el.getBoundingClientRect().top -
            container.getBoundingClientRect().top;
          setPinTop(Math.max(0, elTop));
        }
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [albumSections]);

  const trailColor = `hsl(${158 - pinProgress * 60}, ${70 - pinProgress * 30}%, ${45 + pinProgress * 10}%)`;

  const openViewer = (
    photos: string[],
    startIndex: number,
    title: string,
    year: string,
  ) => {
    setViewer({ photos, startIndex, title, year });
  };

  const formatYear = (yearString: string) => {
    try {
      const date = new Date(yearString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return yearString;
    }
  };

  const formatShortYear = (yearString: string) => {
    try {
      const date = new Date(yearString);
      return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return yearString;
    }
  };

  return (
    <div className="min-h-screen bg-app text-body">
      <Navbar />

      <section className="pt-32 pb-12 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
            {t.albums.title}
          </h1>
          <p className="text-xl text-zinc-500">
            {albumSections.length} album{albumSections.length > 1 ? "s" : ""} •
            Triés du plus récent au plus ancien
          </p>
        </motion.div>
      </section>

      <div
        ref={containerRef}
        className="max-w-7xl mx-auto px-4 pb-32 flex gap-0 relative"
      >
        <div className="w-20 flex-shrink-0 relative hidden md:block">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] rounded-full bg-card" />

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] rounded-full origin-top"
            style={{
              height: `${pinProgress * 100}%`,
              background: `linear-gradient(to bottom, var(--color-primary), ${trailColor})`,
              boxShadow: `0 0 8px 1px ${trailColor}55`,
            }}
          />

          <motion.div
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ top: pinTop }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            animate={{ top: pinTop }}
          >
            <div className="flex flex-col items-center">
              <div
                className="relative flex flex-col items-center"
                style={{ filter: `drop-shadow(0 4px 12px ${trailColor}88)` }}
              >
                <div
                  className="px-2.5 py-1 rounded-xl text-white text-[11px] font-black tracking-widest mb-1 whitespace-nowrap"
                  style={{ background: trailColor }}
                >
                  {formatShortYear(activeYear)}
                </div>
                <div
                  className="w-4 h-4 rounded-full ring-4 ring-white/20"
                  style={{ background: trailColor }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 space-y-20 pl-0 md:pl-6">
          {loading ? (
            <div className="grid grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl animate-pulse bg-card`}
                />
              ))}
            </div>
          ) : albumSections.length === 0 ? (
            <div className="text-center py-24">
              <ImageIcon className="mx-auto mb-4 opacity-20" size={64} />
              <p
                className={`text-lg ${isDark ? "text-zinc-600" : "text-stone-400"}`}
              >
                Aucun album disponible
              </p>
            </div>
          ) : (
            albumSections.map((album) => {
              const LIMIT = 15;
              const hasMore = album.photos.length > 16;
              const displayed = hasMore
                ? album.photos.slice(0, LIMIT)
                : album.photos;

              return (
                <div
                  key={album.id}
                  ref={(el) => {
                    albumRefs.current[album.id] = el;
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="flex items-start md:items-center flex-col md:flex-row gap-3 mb-6"
                  >
                    <div
                      className={`hidden md:block w-3 h-3 rounded-full ring-4 flex-shrink-0 -ml-[2.35rem] ring-subtle`}
                      style={{
                        background:
                          activeYear === album.year
                            ? trailColor
                            : "var(--bg-card)",
                      }}
                    />

                    <div className="flex-1">
                      <h2
                        className={`text-3xl font-black tracking-tighter ${
                          isDark ? "text-zinc-100" : "text-stone-800"
                        }`}
                      >
                        {album.title}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar
                          size={14}
                          className={
                            isDark ? "text-zinc-600" : "text-stone-400"
                          }
                        />
                        <span
                          className={`text-sm ${
                            isDark ? "text-zinc-500" : "text-stone-500"
                          }`}
                        >
                          {formatYear(album.date)}
                        </span>
                        <span
                          className={`text-xs ${isDark ? "text-zinc-700" : "text-stone-300"}`}
                        >
                          •
                        </span>
                        <span
                          className={`text-xs font-bold uppercase tracking-widest ${
                            isDark ? "text-zinc-600" : "text-stone-400"
                          }`}
                        >
                          {album.photos.length} photo
                          {album.photos.length > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>

                    <div className="h-px flex-1 hidden lg:block bg-card" />
                  </motion.div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {displayed.map((photo, pIdx) => (
                      <motion.div
                        key={pIdx}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: pIdx * 0.04 }}
                        onClick={() =>
                          openViewer(
                            album.photos,
                            pIdx,
                            album.title,
                            album.year,
                          )
                        }
                        className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-0.5"
                      >
                        {photo ? (
                          <Image
                            src={getMediaUrl(photo)}
                            alt={`${album.title}-${pIdx}`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            unoptimized={photo.startsWith("http")}
                          />
                        ) : (
                          <div
                            className={`w-full h-full flex items-center justify-center ${
                              isDark ? "bg-zinc-800" : "bg-stone-200"
                            }`}
                          >
                            <ImageIcon className="opacity-30" size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
                      </motion.div>
                    ))}

                    {hasMore && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: LIMIT * 0.04 }}
                        onClick={() =>
                          openViewer(album.photos, 0, album.title, album.year)
                        }
                        className={`group relative aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 border-dashed transition-all duration-300 hover:-translate-y-0.5 flex flex-col items-center justify-center gap-3 ${
                          isDark
                            ? "border-zinc-700 hover:border-emerald-600 bg-zinc-900/60 hover:bg-zinc-900"
                            : "border-stone-300 hover:border-emerald-500 bg-stone-100 hover:bg-white"
                        }`}
                      >
                        <div className="grid grid-cols-2 gap-1 w-14 h-14 rounded-xl overflow-hidden opacity-50 group-hover:opacity-80 transition-opacity">
                          {album.photos.slice(LIMIT, LIMIT + 4).map((p, i) => (
                            <div key={i} className="relative w-full h-full">
                              {p && (
                                <Image
                                  src={getMediaUrl(p)}
                                  alt=""
                                  fill
                                  className="object-cover"
                                  unoptimized={p.startsWith("http")}
                                />
                              )}
                            </div>
                          ))}
                        </div>

                        <div className="text-center px-2">
                          <p
                            className={`text-sm font-black ${
                              isDark
                                ? "text-zinc-300 group-hover:text-emerald-400"
                                : "text-stone-600 group-hover:text-emerald-600"
                            } transition-colors`}
                          >
                            +{album.photos.length - LIMIT} photos
                          </p>
                          <p
                            className={`text-[10px] uppercase tracking-widest mt-0.5 ${
                              isDark ? "text-zinc-600" : "text-stone-400"
                            }`}
                          >
                            {t.home.seeAll}
                          </p>
                        </div>

                        <Grid
                          size={16}
                          className={`${
                            isDark
                              ? "text-zinc-600 group-hover:text-emerald-500"
                              : "text-stone-400 group-hover:text-emerald-500"
                          } transition-colors`}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <AnimatePresence>
        {viewer && (
          <PhotoViewer
            photos={viewer.photos}
            startIndex={viewer.startIndex}
            albumTitle={viewer.title}
            albumYear={formatYear(viewer.year)}
            onClose={() => setViewer(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
