// src/components/ui/CookieBanner.tsx
"use client";

import React, { JSX, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import AuroraButton from "./AuroraButton";

type ConsentValue = "accepted" | "declined";

// Bump the storage key so the banner reappears on first load after deploy.
export const COOKIE_STORAGE_KEY = "cookie-consent-v2";

export function CookieBanner(): JSX.Element | null {
  const [consent, setConsent] = useState<ConsentValue | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(COOKIE_STORAGE_KEY) as ConsentValue | null;
    if (stored === "accepted" || stored === "declined") {
      setConsent(stored);
    }
  }, []);

  const handleConsent = (value: ConsentValue) => {
    try {
      window.localStorage.setItem(COOKIE_STORAGE_KEY, value);
    } catch {}
    setConsent(value);

    // 👉 Later: initialize tracking ONLY if value === "accepted"
    // if (value === "accepted") initAnalytics();
  };

  // Only show banner if mounted and no stored consent.
  if (!isMounted || consent !== null) return null;

  // Portal only on the client.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="flex items-center justify-center px-4 sm:px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        isolation: "isolate",
        pointerEvents: "auto",
      }}
    >
      {/* Overlay blur behind the card (must not intercept clicks) */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.45)", backdropFilter: "blur(10px)", pointerEvents: "none" }}
        aria-hidden
      />

      <div className="w-[min(88vw,380px)] max-w-[380px] relative z-10 pointer-events-auto">
        <div
          className="relative bg-white/[0.035] backdrop-blur-xl rounded-3xl p-10 sm:p-11 flex flex-col items-center text-center border border-white/12 heavy-blur overflow-hidden"
          style={{
            boxShadow: "0 0 26px rgba(90,0,255,0.32), 0 0 36px rgba(56,189,248,0.22)",
          }}
        >
          <div
            className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#51158C]/30 via-[#182E6F]/18 to-[#0f172a]/10 opacity-55"
            aria-hidden
          />
          <div
            className="absolute inset-0 rounded-3xl blur-2xl opacity-75 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 35% 25%, rgba(124,58,237,0.3), transparent 52%), radial-gradient(circle at 70% 70%, rgba(56,189,248,0.26), transparent 52%)",
            }}
            aria-hidden
          />

          <div className="relative z-10 flex flex-col items-center gap-5 sm:gap-6 pointer-events-auto">
            <div className="space-y-3" style={{ marginBottom: "1.5rem" }}>
              <p
                className="text-[0.68rem] sm:text-xs font-semibold uppercase tracking-[0.22em]"
                style={{ color: "rgba(200,200,200,0.85)" }}
              >
                COSMIC COOKIES
              </p>
              <p
                className="text-[0.46rem] sm:text-[0.64rem] leading-relaxed"
                style={{ fontSize: "0.75rem", color: "rgba(200,200,200,0.85)", marginTop: "0.75rem"   }}
              >
                I use cookies and similar technologies to understand how this site is used
                <br />
                and to keep your experience smooth and stable.
                <br />
                You can accept all cookies or continue with only essential ones.
              </p>
            </div>

            <div className="flex flex-col gap-3 w-full justify-center pointer-events-auto">
              <AuroraButton
                label="ACCEPT ALL"
                className="w-full px-8 sm:px-12 py-3 text-xs sm:text-sm tracking-[0.22em]"
                onClick={() => handleConsent("accepted")}
              />
              <AuroraButton
                label="ESSENTIAL ONLY"
                className="w-full px-8 sm:px-12 py-2.5 tracking-[0.2em] bg-white/5 border border-white/25"
                style={{ fontSize: "0.7rem" }}
                onClick={() => handleConsent("declined")}
              />
            </div>

            <p
              className="leading-relaxed mt-2"
              style={{ fontSize: "0.75rem", color: "rgba(200,200,200,0.7)" }}
            >
              You can change your choice at any time in your browser settings.
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
