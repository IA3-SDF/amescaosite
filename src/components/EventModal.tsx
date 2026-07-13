"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Calendar, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useTheme } from "../components/ThemeContext";
import { getMediaUrl } from "../services/supabase";
import { EventData } from "../types";
import HtmlContent from "./HtmlContent";

interface EventModalProps {
  event: EventData;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl ${
            isDark ? "bg-zinc-900" : "bg-white"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${
              isDark
                ? "bg-zinc-800 hover:bg-zinc-700 text-white"
                : "bg-white/90 hover:bg-white text-stone-800"
            }`}
          >
            <X size={20} />
          </button>

          {/* Image de couverture */}
          {event.cover_photo && (
            <div className="relative w-full aspect-video">
              <Image
                src={getMediaUrl(event.cover_photo)}
                alt={event.title}
                fill
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover rounded-t-3xl"
                priority
                unoptimized={event.cover_photo.startsWith("http")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {event.title}
                </h2>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contenu */}
          <div className="p-6 md:p-8">
            {!event.cover_photo && (
              <>
                <h2
                  className={`text-2xl md:text-3xl font-bold mb-4 ${isDark ? "text-zinc-100" : "text-stone-900"}`}
                >
                  {event.title}
                </h2>
                <div
                  className={`flex items-center gap-4 text-sm mb-6 ${isDark ? "text-zinc-400" : "text-stone-500"}`}
                >
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} />
                    <span>
                      {new Date(event.date).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            <div className={`prose max-w-none ${isDark ? "prose-invert" : ""}`}>
              <HtmlContent
                html={event.content ?? ""}
                className={`text-base leading-relaxed ${
                  isDark ? "text-zinc-300" : "text-stone-600"
                }`}
              />
            </div>

            {/* Galerie other_photos */}
            {event.other_photos && event.other_photos.length > 0 && (
              <div className="mt-8">
                <h3
                  className={`text-lg font-bold mb-4 ${isDark ? "text-zinc-200" : "text-stone-800"}`}
                >
                  Galerie photos
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {event.other_photos.map((photo, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <Image
                        src={getMediaUrl(photo)}
                        alt={`${event.title} - photo ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        unoptimized={photo.startsWith("http")}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
