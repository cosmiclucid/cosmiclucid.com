// src/components/ui/CookieBanner.tsx
"use client";

import React, { JSX, useEffect, useState } from "react";

type ConsentValue = "accepted" | "declined";

const STORAGE_KEY = "cookie-consent";

export function CookieBanner(): JSX.Element | null {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
    }
  }, []);

  const handleConsent = (value: ConsentValue) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
      setConsent(value);

      // 👉 Hier später Google Analytics / Tracking initialisieren,
      // aber NUR wenn value === "accepted"
      // if (value === "accepted") {
      //   initAnalytics();
      // }
    }
  };

  if (!isMounted || consent !== null) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4 sm:px-6">
      <div
        className="
          pointer-events-auto
          max-w-3xl w-full
          rounded-3xl border border-white/15
          bg-slate-950/85
          backdrop-blur-2xl
          shadow-[0_18px_60px_rgba(0,0,0,0.75)]
          px-5 py-4 sm:px-7 sm:py-5
          relative overflow-hidden
        "
      >
        {/* Glow background */}
        <div className="pointer-events-none absolute -inset-0.5 -z-10 rounded-3xl bg-gradient-to-r from-[#5A00FF]/30 via-transparent to-cyan-400/25 opacity-70 blur-2xl" />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/70">
              COSMIC COOKIES
            </p>
            <p className="text-sm text-white/85 leading-relaxed">
              I use cookies and similar technologies to understand how this site is used and to keep your experience smooth and stable. You can accept all cookies or continue with only essential ones.
            </p>
            <p className="text-[0.7rem] text-white/50">
              You can change your choice at any time in your browser settings.
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2 sm:mt-0 sm:min-w-[210px]">
            <button
              onClick={() => handleConsent("accepted")}
              className="
                w-full rounded-full px-4 py-2 text-xs font-semibold
                uppercase tracking-[0.18em]
                bg-gradient-to-r from-[#5A00FF] via-[#8B5CFF] to-[#4FD1C5]
                text-white
                shadow-[0_0_25px_rgba(90,0,255,0.75)]
                hover:shadow-[0_0_30px_rgba(90,0,255,0.95)]
                transition-all duration-200
              "
            >
              ACCEPT ALL
            </button>

            <button
              onClick={() => handleConsent("declined")}
              className="
                w-full rounded-full px-4 py-2 text-[0.7rem] font-semibold
                uppercase tracking-[0.18em]
                border border-white/30 text-white/80
                bg-white/5 hover:bg-white/10
                transition-colors duration-200
              "
            >
              ESSENTIAL ONLY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}