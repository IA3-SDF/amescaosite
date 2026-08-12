"use client";

import React, { useEffect, useState } from "react";
import Footer from "./Footer";

interface Props {
  className?: string;
}

const PWAFooterGuard: React.FC<Props> = ({ className = "" }) => {
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const detect = () => {
      if (typeof window === "undefined") return false;
      const nav = window.navigator as any;

      const displayModeStandalone =
        typeof window.matchMedia === "function" &&
        window.matchMedia("(display-mode: standalone)").matches;

      const iosStandalone = nav && nav.standalone === true;

      return Boolean(displayModeStandalone || iosStandalone);
    };

    setIsInstalled(detect());

    const onAppInstalled = () => setIsInstalled(true);
    window.addEventListener("appinstalled", onAppInstalled);

    let mql: MediaQueryList | null = null;
    const mqHandler = (e: MediaQueryListEvent) => setIsInstalled(e.matches);

    if (typeof window.matchMedia === "function") {
      mql = window.matchMedia("(display-mode: standalone)");
      if (mql.addEventListener) mql.addEventListener("change", mqHandler);
      else mql.addListener(mqHandler);
    }

    return () => {
      window.removeEventListener("appinstalled", onAppInstalled);
      if (mql) {
        if (mql.removeEventListener) mql.removeEventListener("change", mqHandler);
        else mql.removeListener(mqHandler);
      }
    };
  }, []);

  if (isInstalled) return null;
  return <Footer className={className} />;
};

export default PWAFooterGuard;
