import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, TrendingUp, Video, Palette, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import AuroraButton from "../components/ui/AuroraButton";
import { ScrollTimeline } from "../components/ui/ScrollTimeline";
import { UniverseCard } from "../components/UniverseCard";
import { MarketingOrbVisual } from "../components/ui/MarketingOrbVisual";
import { useClientEnv } from "../hooks/useClientEnv";

// Tilt interaction (mirrors homepage behavior)
function Tilt({ children, disabled = false }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rot, setRot] = useState({ rx: 0, ry: 0 });
  const frameRef = useRef<number | null>(null);
  const pendingPos = useRef<{ x: number; y: number } | null>(null);

  if (disabled) return <>{children}</>;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        pendingPos.current = {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        };
        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null;
          const next = pendingPos.current;
          if (!next) return;
          const rx = (0.5 - next.y) * 6;
          const ry = (next.x - 0.5) * 6;
          setRot({ rx, ry });
        });
      }}
      onMouseLeave={() => {
        pendingPos.current = null;
        frameRef.current && cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        setRot({ rx: 0, ry: 0 });
      }}
      style={{ perspective: "1000px" }}
      className="will-change-transform"
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: rot.rx, rotateY: rot.ry }}
        transition={{ type: "spring", stiffness: 140, damping: 14, mass: 0.6 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const serviceCards = [
  {
    icon: <Palette className="w-8 h-8 text-purple-200" />,
    title: "Branding & AV Production",
    description:
      "Create the strategic foundation of your brand — naming, identity, and cinematic visual assets that elevate your message and power every marketing channel.",
    glow: "purple" as const,
    buttonText: "Ignite Your Brand",
  },
  {
    icon: <Video className="w-8 h-8 text-cyan-200" />,
    title: "Website Design & Development",
    description:
      "Design and build a fast, high-converting website that showcases your identity, communicates your value, and turns visitors into qualified customers.",
    glow: "blue" as const,
    buttonText: "BUILD YOUR WEBSITE",
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-emerald-200" />,
    title: "Performance Marketing",
    description:
      "Build a performance engine that attracts the right audiences, delivers the right message, and scales your revenue through intelligent, data-driven optimization.",
    glow: "violet" as const,
    buttonText: "GROW YOUR BRAND",
  },
];

const timelineEvents = [
  { id: "discover", year: "01", title: "Discover", description: "Brand, audience and performance audit." },
  { id: "design", year: "02", title: "Design", description: "Strategy, content, funnel." },
  { id: "deploy", year: "03", title: "Deploy", description: "Launch site, content & ads." },
  { id: "scale", year: "04", title: "Scale", description: "Optimization & growth." },
];

export default function MarketingPage() {
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleContact = () => scrollToSection("contact");

  const { isSmallScreen, prefersReducedMotion, isMobile } = useClientEnv();
  const disableTilt = isSmallScreen || isMobile || prefersReducedMotion;
  const STAR_COUNT = isSmallScreen ? 12 : 48;
  const topSpacerHeight = 0;
  const heroTextTransform = "translateY(0)";
  const heroFlexWrap = isSmallScreen ? "wrap" : "nowrap";

  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );

    reveals.forEach((r) => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const stars = useMemo(
    () =>
      prefersReducedMotion
        ? []
        : Array.from({ length: STAR_COUNT }).map((_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            delay: `${(Math.random() * 2.5).toFixed(2)}s`,
            opacity: (Math.random() * 0.6 + 0.3).toFixed(2),
          })),
    [STAR_COUNT, prefersReducedMotion]
  );


  return (
    <main className="marketing-page relative z-10 min-h-screen text-white">
      <div
        className="about-top-spacer"
        aria-hidden
        style={{ height: `${topSpacerHeight}px`, pointerEvents: "none" }}
      />

      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
        aria-hidden
      >
        <div style={{ position: "absolute", inset: 0 }}>
          {stars.map((s) => (
            <div
              key={s.id}
              className="star"
              style={{
                position: "absolute",
                width: 2,
                height: 2,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                top: s.top,
                left: s.left,
                opacity: Number(s.opacity),
                animation: prefersReducedMotion
                  ? "none"
                  : `aboutStarPulse 2.6s ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* HEADLINE */}
      <section className="pt-32 pb-24">
        <div className="relative text-center mb-20 mt-10 md:mt-20 flex flex-col items-center px-6">
          <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[260px] bg-gradient-radial from-[#51158C]/25 via-[#182E6F]/30 to-transparent blur-[120px] opacity-70 pointer-events-none" />

          <h1
            className="mb-5 tracking-wide headline-gradient"
            style={{
              fontSize: "clamp(3rem, 6vw, 5.5rem)",
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: "transparent",
            }}
          >
            MARKETING
          </h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "520px", opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.7, ease: "easeOut" }}
            className="mt-5 mx-auto h-[2px] w-full max-w-[580px] relative overflow-visible"
            style={{ marginBottom: "4rem" }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(150,20,100,0.35) 0%, rgba(210,50,130,0.95) 50%, rgba(150,20,100,0.35) 100%)",
                boxShadow: "0 0 28px rgba(210, 50, 130, 0.9), 0 0 60px rgba(150, 20, 100, 0.65)",
                filter: "drop-shadow(0 0 22px rgba(210, 50, 130, 0.85))",
                height: "100%",
                borderRadius: "999px",
                opacity: 1,
              }}
            />
            <div
              className="absolute inset-0 rounded-full blur-lg pointer-events-none"
              style={{
                marginBottom: "4rem",
                background:
                  "linear-gradient(90deg, rgba(150,20,100,0.2) 0%, rgba(210,50,130,0.35) 50%, rgba(150,20,100,0.2) 100%)",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* HERO (Copied from About hero setup) */}
      <section
        className="hero"
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexWrap: heroFlexWrap,
          alignItems: "center",
          justifyContent: "space-between",
          gap: "3rem",
          padding: "4rem 10% 5rem",
        }}
      >
        <div
          className="hero-text reveal"
          style={{
            textAlign: "center",
            maxWidth: "640px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, filter: "blur(20px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="tracking-wide headline-gradient"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: "transparent",
              marginBottom: "1.25rem",
            }}
          >
            MARKETING GROWTH ENGINE
          </motion.h1>
          <div className="mt-4 h-[2px] w-full max-w-[320px] relative overflow-visible mx-auto" style={{ marginBottom: "1.5rem" }}>
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(81,21,140,0.18) 0%, rgba(81,21,140,0.95) 50%, rgba(81,21,140,0.18) 100%)",
                boxShadow: "0 0 24px rgba(81, 21, 140, 1), 0 0 56px rgba(81, 21, 140, 0.55)",
                filter: "drop-shadow(0 0 20px rgba(81, 21, 140, 0.8))",
                height: "100%",
                borderRadius: "999px",
              }}
            />
            <div
              className="absolute inset-0 rounded-full blur-lg pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, rgba(81,21,140,0.1) 0%, rgba(81,21,140,0.4) 50%, rgba(81,21,140,0.1) 100%)",
              }}
            />
          </div>
          <p
            className="text-white/70 leading-relaxed mx-auto about-subline"
            style={{
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              maxWidth: "56ch",
              fontSize: "1.2rem",
              textAlign: "center",
            }}
          >
            I help brands express their identity through cinematic content, build trust with strategic social media, and
            grow through performance marketing that reaches the right audiences and converts attention into revenue.
          </p>

          <div style={{ marginTop: "2.5rem" }}>
            <div className="contact-footer flex flex-wrap justify-center gap-3">
              <AuroraButton
                label="SCALE YOUR BRAND"
                className="px-10 sm:px-14 py-4 text-base tracking-[0.3em]"
                onClick={handleContact}
              />
              <AuroraButton
                label="SEE SERVICES"
                className="px-9 sm:px-12 py-4 text-xs sm:text-sm tracking-[0.26em]"
                onClick={() => scrollToSection("services")}
              />
            </div>
          </div>

          <div
            className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/85 tracking-[0.22em]"
            style={{ marginTop: "1.5rem", textTransform: "uppercase" }}
          >
            <span>Custom brand strategy</span>
            <span className="opacity-60">•</span>
            <span>High-end video &amp; audio</span>
            <span className="opacity-60">•</span>
            <span>Full-funnel ad management</span>
          </div>
        </div>

        <div className="hero-img reveal flex flex-col items-center justify-center gap-6" style={{ flex: 1.1, maxWidth: "560px", margin: "0 auto" }}>
          <MarketingOrbVisual />
        </div>

      </section>

      {/* SERVICES CARDS */}
      <section
        id="services"
        className="py-24"
        style={{ scrollMarginTop: "6rem" }}
      >
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div
            className="text-center"
            style={{
              marginTop: "8rem",
              marginBottom: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <h2
              className="tracking-wide headline-gradient"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
                lineHeight: 1.05,
                textTransform: "uppercase",
                color: "transparent",
                marginBottom: "0.4rem",
              }}
            >
              MY SERVICES
            </h2>
            <div
              className="text-lg md:text-xl font-semibold text-white/90 tracking-[0.18em] uppercase"
              style={{ marginBottom: "0.2rem" }}
            >
              From Brand to Funnel
            </div>
            <div
              className="text-white text-xs md:text-sm tracking-[0.22em] uppercase"
              style={{ marginBottom: "0.2rem" }}
            >
              — A Complete Growth Engine to Scale Your Business —.
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-10 items-stretch">
            {serviceCards.map((card, index) => {
              const tilt = index === 1 ? "center" : index === 2 ? "right" : "left";
              const offset =
                tilt === "left" ? "-20px" : tilt === "right" ? "20px" : "0px";
              return (
                <Tilt key={card.title} disabled={disableTilt}>
                  <div
                    className="relative"
                    style={{
                      transform: disableTilt
                        ? "translateX(0px) translateY(0px)"
                        : `translateX(${offset}) translateY(0px)`,
                    }}
                  >
                    <div className="relative z-10">
                      <UniverseCard
                        icon={card.icon}
                        title={card.title.toUpperCase()}
                        description={card.description}
                        buttonText={card.buttonText ?? "REQUEST OFFER"}
                        buttonHref="#contact"
                        glowColor={card.glow}
                        delay={0.15 * index}
                        tilt={tilt}
                      />
                    </div>
                  </div>
                </Tilt>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES PIPELINE TIMELINE */}
      <section className="py-24 bg-white/5 border-y border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="text-center"
            style={{
              marginTop: "8rem",
              marginBottom: "-8rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <h2
              className="tracking-wide headline-gradient"
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
                lineHeight: 1.05,
                textTransform: "uppercase",
                color: "transparent",
                marginBottom: "0.4rem",
              }}
            >
              SERVICE PIPELINE
            </h2>
          </div>
          <ScrollTimeline title="SERVICES PIPELINE" subtitle="HOW WE WORK" events={timelineEvents} />
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact" className="py-24 border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/8 via-black/55 to-black px-8 py-12 md:px-12 md:py-14 text-center shadow-[0_24px_70px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Ready To Scale Your Brand To Its{" "}
              <span className="headline-gradient text-transparent bg-clip-text">Deserved State?</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-white/80 leading-relaxed">
              Tell me where you are now and where you want to go. I&apos;ll design the path.
            </p>
            <div className="mt-8 flex justify-center">
              <AuroraButton
                label="BOOK A FREE DISCOVERY CALL"
                className="px-10 py-5 text-sm tracking-[0.26em]"
                onClick={() => (window.location.href = "/contact")}
              />
            </div>
          </div>
        </div>
      </section>

      <style>
        {`
          @keyframes aboutStarPulse {
            0%, 100% { opacity: 0.25; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-1px); }
          }

          @keyframes about-hero-float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0); }
          }

          @keyframes about-aura-flare {
            0% { transform: scale(0.95); filter: blur(25px); }
            50% { transform: scale(1.05); filter: blur(35px); }
            100% { transform: scale(0.95); filter: blur(25px); }
          }

          .marketing-page .hero {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-between;
            gap: 3rem;
            padding: 4rem 10% 5rem;
          }

          .marketing-page .hero-text {
            flex: 1;
            min-width: 320px;
            text-align: left;
          }

          .marketing-page .hero-text p {
            font-size: 1.2rem;
            opacity: 0.9;
            max-width: 600px;
          }

          .marketing-page .hero-img {
            flex: 1;
            min-width: 300px;
            border-radius: 1rem;
            position: relative;
            isolation: isolate;
            overflow: visible;
            margin-top: -0px;
            animation: about-hero-float 6s ease-in-out infinite;
            --aura-x: 50%;
            --aura-y: 50%;
            --aura-opacity: 0;
          }

          .marketing-page .hero-img::after {
            content: "";
            position: absolute;
            inset: -18%;
            border-radius: 100%;
            opacity: var(--aura-opacity);
            pointer-events: none;
            mix-blend-mode: screen;
            z-index: -1;
            background:
              radial-gradient(circle at var(--aura-x) var(--aura-y),
                rgba(16, 203, 255, 0.75),
                rgba(37, 99, 235, 0.55),
                rgba(124, 58, 237, 0.4),
                transparent 70%);
            filter: blur(40px);
            transition: opacity 0.s ease;
            animation: about-aura-flare 6s ease-in-out infinite;
          }

          .marketing-page .hero-img img {
            border-radius: 1rem;
            display: block;
            width: 100%;
            height: auto;
            object-fit: cover;
          }

          @media (max-width: 900px) {
            .marketing-page .hero {
              gap: 1.75rem;
            }

            .marketing-page .hero-text {
              margin-bottom: 1.2rem;
            }
          }
        `}
      </style>
    </main>
  );
}
