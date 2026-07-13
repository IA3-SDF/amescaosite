"use client";

import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { MapPin } from "lucide-react";
import React, { useRef } from "react";

interface TimelineProps {
  items: {
    id: string | number;
    date: string;
    title: string;
    content: React.ReactNode;
  }[];
}

const Timeline: React.FC<TimelineProps> = ({ items }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Dynamic color based on scroll progress — prefer theme CSS vars when available
  const getRootVar = (name: string) => {
    if (typeof window === "undefined") return "";
    return getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  };

  const hexToRgb = (hex: string) => {
    if (!hex) return null;
    hex = hex.replace("#", "").trim();
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const int = parseInt(hex, 16);
    if (Number.isNaN(int)) return null;
    const r = (int >> 16) & 255;
    const g = (int >> 8) & 255;
    const b = int & 255;
    return `${r}, ${g}, ${b}`;
  };

  const readColorRgb = (
    varName: string,
    fallbackVar: string,
    fallbackHex: string,
  ) => {
    const val = getRootVar(varName) || getRootVar(fallbackVar);
    if (!val) return hexToRgb(fallbackHex);
    // val may be rgb(...) or a hex string
    if (val.startsWith("rgb")) {
      // extract numbers
      const nums = val.replace(/[^0-9,]/g, "");
      return nums;
    }
    if (val.startsWith("#")) return hexToRgb(val);
    return hexToRgb(fallbackHex);
  };

  const primaryRgb = readColorRgb("--color-primary", "--color-primary", "");
  const secondaryRgb = readColorRgb(
    "--color-secondary",
    "--color-secondary",
    "",
  );
  const accentRgb = readColorRgb("--color-accent", "--color-accent", "");

  const primaryColor = primaryRgb
    ? `rgb(${primaryRgb})`
    : "var(--color-primary)";
  const secondaryColor = secondaryRgb
    ? `rgb(${secondaryRgb})`
    : "var(--color-secondary)";
  const accentColor = accentRgb ? `rgb(${accentRgb})` : "var(--color-accent)";

  const primaryGlow = primaryRgb
    ? `rgba(${primaryRgb}, 0.5)`
    : "rgba(99,102,241,0.5)";
  const secondaryGlow = secondaryRgb
    ? `rgba(${secondaryRgb}, 0.5)`
    : "rgba(236,72,153,0.5)";
  const accentGlow = accentRgb
    ? `rgba(${accentRgb}, 0.5)`
    : "rgba(245,158,11,0.5)";

  const lineColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [primaryColor, secondaryColor, accentColor],
  );
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [primaryGlow, secondaryGlow, accentGlow],
  );

  return (
    <div
      ref={containerRef}
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
    >
      {/* Vertical Line Background */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 -translate-x-1/2 rounded-full" />

      {/* Animated Vertical Line */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full overflow-hidden">
        <motion.div
          style={{
            scaleY,
            originY: 0,
            backgroundColor: lineColor,
            boxShadow: useTransform(glowColor, (v) => `0 0 20px ${v}`),
          }}
          className="absolute top-0 left-0 right-0 bottom-0"
        />
      </div>

      {/* Luminous Point */}
      <motion.div
        style={{
          top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
          left: "50%",
          x: "-50%",
          backgroundColor: lineColor,
          boxShadow: useTransform(glowColor, (v) => `0 0 30px 10px ${v}`),
        }}
        className="hidden md:block absolute z-30 w-6 h-6 rounded-full border-4 border-white dark:border-slate-900 transition-colors duration-300"
      >
        <div className="absolute inset-0 rounded-full animate-ping bg-current opacity-20" />
      </motion.div>

      <div className="space-y-48">
        {items.map((item, i) => (
          <TimelineItem
            key={item.id}
            item={item}
            index={i}
            scrollYProgress={scrollYProgress}
            totalItems={items.length}
          />
        ))}
      </div>
    </div>
  );
};

const TimelineItem: React.FC<{
  item: {
    id: string | number;
    date: string;
    title: string;
    content: React.ReactNode;
  };
  index: number;
  scrollYProgress: MotionValue<number>;
  totalItems: number;
}> = ({ item, index, scrollYProgress, totalItems }) => {
  const isEven = index % 2 === 0;
  const itemRef = useRef<HTMLDivElement>(null);

  // Calculate when this item is "active"
  const start = index / totalItems;
  const end = (index + 1) / totalItems;

  const isActive = useTransform(
    scrollYProgress,
    [start - 0.1, start, end, end + 0.1],
    [0.5, 1, 1, 0.5],
  );

  const scale = useTransform(
    scrollYProgress,
    [start - 0.1, start, end, end + 0.1],
    [0.95, 1, 1, 0.95],
  );

  return (
    <div
      ref={itemRef}
      className={`relative flex flex-col md:flex-row items-center ${isEven ? "md:flex-row-reverse" : ""}`}
    >
      {/* GPS Pin */}
      <div className="absolute left-4 md:left-1/2 top-0 -translate-x-1/2 z-20">
        <motion.div
          style={{
            scale: useTransform(
              scrollYProgress,
              [start - 0.05, start, start + 0.05],
              [1, 1.5, 1],
            ),
          }}
          className="relative"
        >
          <div className="p-3 bg-white dark:bg-slate-900 rounded-full border-2 border-primary shadow-2xl group transition-all">
            <MapPin
              size={20}
              className="text-primary group-hover:scale-125 transition-transform"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] font-black uppercase tracking-widest shadow-2xl"
          >
            {item.date}
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div
        className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? "md:pr-24" : "md:pl-24"}`}
      >
        <motion.div
          style={{ opacity: isActive, scale }}
          className="glass-card p-10 rounded-[3rem] card-hover relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          {item.content}
        </motion.div>
      </div>

      {/* Spacer for MD */}
      <div className="hidden md:block w-1/2" />
    </div>
  );
};

export default Timeline;
