// Example: /your-content?name=Julia&project=EF%20Shoot&drive=https%3A%2F%2Fdrive.google.com%2F...&review=https%3A%2F%2Fg.page%2Fr%2F...%2Freview
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import AuroraButton from "../components/ui/AuroraButton";

const isValidUrl = (value?: string | null) => {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function YourContentPage() {
  const params = useMemo(() => new URLSearchParams(window.location.search), []);
  const name = params.get("name")?.trim();
  const project = params.get("project")?.trim();
  const drive = params.get("drive")?.trim();
  const review = params.get("review")?.trim();

  const driveValid = isValidUrl(drive);
  const reviewValid = isValidUrl(review);

  const subline = name
    ? `Your content is ready, ${name}.`
    : "Your content is ready.";

  const openLink = (url: string) => window.open(url, "_blank", "noopener,noreferrer");
  const fallbackDrive = "https://drive.google.com/drive/folders/1Ami8UHW2ll32mGtHDqSXoD8eCjmnSDbg?usp=sharing";
  const fallbackReview = "https://g.page/r/CQEWDof6Dmk5EBM/review";
  const reviewTarget = reviewValid && review ? review : fallbackReview;

  return (
    <main
      className="relative z-10 min-h-screen flex flex-col items-center justify-start px-6 text-white"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <div
        className="max-w-3xl w-full text-center space-y-8"
        style={{ marginTop: "2.5rem", marginLeft: "auto", marginRight: "auto" }}
      >
        <div className="relative flex flex-col items-center gap-4">
          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="tracking-wide headline-gradient"
            style={{
              fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: "transparent",
              backgroundImage: "linear-gradient(90deg, #1BA3FF 0%, #0052FF 52%, #5A00FF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              marginTop: "1.5rem",
            }}
          >
            YOUR CONTENT
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "min(100%, 420px)", opacity: 1 }}
            transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
            className="h-[2px] w-full max-w-[520px] relative overflow-visible"
            style={{ marginBottom: "-0.5rem" }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(81,21,140,0.35) 0%, rgba(124,58,237,0.95) 50%, rgba(81,21,140,0.35) 100%)",
                boxShadow: "0 0 24px rgba(124,58,237,0.9), 0 0 44px rgba(81,21,140,0.55)",
                height: "100%",
                borderRadius: "999px",
              }}
            />
            <div
              className="absolute inset-0 rounded-full blur-lg pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(81,21,140,0.14) 0%, rgba(124,58,237,0.32) 50%, rgba(81,21,140,0.14) 100%)",
              }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="text-center text-white leading-relaxed"
            style={{
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontSize: "clamp(0.9rem, 2.4vw, 1.1rem)",
              marginTop: "1rem",
            }}
          >
            {subline}
          </motion.p>
        </div>

        <div className="space-y-6 flex flex-col items-center text-center">
          {/* Primary CTA */}
          <div className="flex flex-col items-center justify-center" style={{ marginTop: "8rem" }}>
            <p
              className="text-white/70 text-[0.8rem] sm:text-[0.85rem] tracking-[0.12em] uppercase"
              style={{ marginBottom: "1rem", marginLeft: "auto", marginRight: "auto" }}
            >
              Your files are ready for download.
            </p>

            <AuroraButton
              label="GET YOUR CONTENT"
              className="w-full max-w-[420px] px-10 sm:px-14 py-5 text-xs sm:text-sm tracking-[0.28em]"
              onClick={() => openLink(driveValid && drive ? drive : fallbackDrive)}
            />
          </div>

          {/* Review prompt */}
          <p
            className="text-white/70 text-[0.8rem] sm:text-[0.85rem] tracking-[0.08em] text-center"
            style={{ marginTop: "4rem", marginLeft: "auto", marginRight: "auto", maxWidth: "28rem" }}
          >
            If you enjoyed the experience,
            <br className="block sm:hidden" />
            &nbsp;I’d really appreciate your feedback.
          </p>

          {/* Secondary CTA */}
          <div className="flex justify-center" style={{ marginTop: "1rem", marginBottom: "0.5rem" }}>
            <AuroraButton
              label="LEAVE A GOOGLE REVIEW"
              className="w-full max-w-[420px] px-10 sm:px-12 py-4 text-[0.7rem] sm:text-xs tracking-[0.22em] opacity-90 hover:opacity-100"
              onClick={() => openLink(reviewTarget)}
              style={{ marginTop: "0rem" }}
            />
          </div>

          {/* Optional small footer note */}
          <p
            className="text-white/50 text-[0.7rem] tracking-[0.1em] uppercase text-center"
            style={{ marginTop: "0.6rem", marginLeft: "auto", marginRight: "auto" }}
          >
            Thanks for the collaboration.
          </p>
        </div>
      </div>
    </main>
  );
}
