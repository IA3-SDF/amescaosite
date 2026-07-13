"use client";

import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { sendContactEmail } from "../actions/sendEmail";
import { useLanguage } from "../components/LanguageContext";
import Navbar from "../components/Navbar";
import { supabase } from "../services/supabase/client";
import { translations } from "../types";

export default function Contact() {
  const { language } = useLanguage();
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadCurrentUserEmail = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (!error && user?.email) {
          setFormData((current) => ({ ...current, email: user.email ?? "" }));
        }
      } catch (err) {
        console.error("Error loading current user email:", err);
      }
    };

    void loadCurrentUserEmail();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await sendContactEmail(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || t.contact.successMessage,
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        setMessage({
          type: "error",
          text: result.error || t.contact.errorMessage,
        });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setMessage({
        type: "error",
        text: t.contact.errorSendMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app text-main">
      <Navbar />

      <section className="pt-32 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
              {t.contact.title}
            </h1>
            <p className="text-xl text-body">{t.contact.introText}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-emerald-600/10 rounded-2xl text-emerald-600">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {t.contact.emailTitle}
                    </h3>
                    <p className="text-zinc-500">amescao2026@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-emerald-600/10 rounded-2xl text-emerald-600">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {t.contact.phoneTitle}
                    </h3>
                    <p className="text-zinc-500">+228 71 28 08 08</p>
                  </div>
                </div>
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-emerald-600/10 rounded-2xl text-emerald-600">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {t.contact.addressTitle}
                    </h3>
                    <p className="text-zinc-500">Canton d&apos;Aouda, Togo</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 p-8 bg-emerald-600 rounded-2xl text-white">
                <h3 className="text-2xl font-bold mb-4">
                  {t.contact.openingHoursTitle}
                </h3>
                <p className="opacity-90 mb-2">
                  {t.contact.openingHoursWeekdays}
                </p>
                <p className="opacity-90">{t.contact.openingHoursSaturday}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="card p-8 rounded-3xl shadow-2xl"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 p-4 rounded-2xl ${
                      message.type === "success"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle size={20} className="shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={20} className="shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium">{message.text}</p>
                  </motion.div>
                )}

                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2 text-muted">
                    {t.contact.formName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-card border border-subtle rounded-2xl focus:ring-2 focus:ring-primary text-body placeholder:text-muted transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2 text-muted">
                    {t.contact.formEmail}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={isLoading}
                    className="w-full px-6 py-4 rounded-2xl border border-subtle bg-white/90 text-slate-900 shadow-sm outline-none ring-0 dark:bg-slate-900/90 dark:text-slate-100 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold uppercase tracking-widest mb-2 text-muted">
                    {t.contact.formMessage}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-card border border-subtle rounded-2xl focus:ring-2 focus:ring-primary text-body placeholder:text-muted transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 btn-primary hover:bg-primary-700 text-white rounded-2xl font-bold text-lg transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.contact.sending}
                    </>
                  ) : (
                    <>
                      {t.contact.formSubmit} <Send size={20} />
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
