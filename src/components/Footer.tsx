"use client";

import {
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useLanguage } from "./LanguageContext";

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = "" }) => {
  const { t } = useLanguage();

  return (
    <footer
      className={`bg-secondary border-t border-subtle pt-16 pb-8 ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative h-8 w-8 overflow-hidden rounded-xl border border-black/5 bg-[#f8f6ef] p-1 shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
                <Image
                  src="/AMESCAO.PrincipalLogoIcon.svg"
                  alt="AMESCAO Logo"
                  fill
                  sizes="32px"
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl tracking-tight text-main">
                AMESCAO
              </span>
            </div>
            <p className="text-muted max-w-md mb-8">{t.home.heroSubtitle}</p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="p-2 rounded-full bg-card shadow-sm hover:text-primary transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-card shadow-sm hover:text-primary transition-colors"
              >
                <Twitter size={20} />
              </Link>
              <Link
                href="#"
                className="p-2 rounded-full bg-card shadow-sm hover:text-primary transition-colors"
              >
                <Instagram size={20} />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-main">
              {t.nav.contact}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3 text-muted">
                {/* On ajoute une largeur fixe à l'icône pour qu'elles soient toutes alignées sur la même colonne */}
                <div className="w-7 flex justify-start items-center">
                  <Mail size={18} className="text-primary shrink-0" />
                </div>
                <span>amescao2026@gmail.com</span>
              </li>

              <li className="flex items-center space-x-3 text-muted">
                <div className="w-7 flex justify-start items-center">
                  <Phone size={18} className="text-primary shrink-0" />
                </div>
                <span>+228 71 28 08 08</span>
              </li>

              <li className="flex items-center space-x-3 text-muted">
                <div className="w-7 flex justify-start items-center">
                  <MapPin size={18} className="text-primary shrink-0" />
                </div>
                <span>Canton d&apos;Aouda, Togo</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6 text-main">
              {t.common.quickLinks}
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted hover:text-primary transition-colors"
                >
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-muted hover:text-primary transition-colors"
                >
                  {t.nav.events}
                </Link>
              </li>
              <li>
                <Link
                  href="/albums"
                  className="text-muted hover:text-primary transition-colors"
                >
                  {t.nav.albums}
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted hover:text-primary transition-colors"
                >
                  {t.nav.support}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-subtle text-center text-sm text-muted">
          <p>
            © {new Date().getFullYear()} AMESCAO. {t.common.allRightsReserved}
          </p>
          <p className="mt-2">
            | {t.common.developerLabel} {t.common.developerName} |{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
