"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "../../src/components/LanguageContext";
import { useTheme } from "../../src/components/ThemeContext";

export default function TermsPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const [returnToProfile] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return (
        new URLSearchParams(window.location.search).get("from") === "profile"
      );
    }
    return false;
  });
  const isDark = theme === "dark";

  const handleBack = () => {
    router.push(returnToProfile ? "/?profile=1" : "/");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-slate-950 text-slate-50"
          : "bg-[linear-gradient(135deg,#f8fafc_0%,#eef2ff_100%)] text-slate-900"
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={handleBack}
            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
              isDark
                ? "bg-slate-900/70 text-slate-300 hover:bg-slate-800"
                : "bg-white/70 text-slate-700 hover:bg-white"
            }`}
          >
            <ArrowLeft size={16} />
            {returnToProfile ? t.legal.backToProfile : t.legal.backToHome}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
              isDark
                ? "border-slate-800 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
                : "border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
            }`}
            aria-label={t.legal.themeToggleLabel}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        <main className="flex-1">
          <section
            className={`rounded-[32px] border p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.2)] backdrop-blur-xl sm:p-8 lg:p-10 ${
              isDark
                ? "border-slate-800/80 bg-slate-900/70"
                : "border-slate-200/80 bg-white/70"
            }`}
          >
            <div className="mb-8 max-w-3xl">
              <p
                className={`text-xs font-semibold uppercase tracking-[0.35em] ${
                  isDark ? "text-slate-400" : "text-slate-500"
                }`}
              >
                {t.legal.termsEyebrow}
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {t.legal.termsTitle}
              </h1>
              <p
                className={`mt-4 text-base leading-7 sm:text-lg ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {t.legal.termsIntro}
              </p>
            </div>

            <div className="space-y-8">
              {t.legal.termsSections.map((section, index) => (
                <section key={`${section.title}-${index}`}>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p
                    className={`mt-3 text-sm leading-7 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {section.body}
                  </p>
                </section>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
