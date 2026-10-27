import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { serviceContent, type ServiceKind } from "./serviceContent";
import { motion } from "framer-motion";
import AuroraButton from "../components/ui/AuroraButton";
import CollaborateSection from "../components/CollaborateSection";
import { ScrollTimeline } from "../components/ui/ScrollTimeline";
import { UniverseCard } from "../components/UniverseCard";
import ProductionVisual from "../components/ui/ProductionVisual";
import SocialMediaVisual from "../components/ui/SocialMediaVisual";
import WebsiteVisual from "../components/ui/WebsiteVisual";
import { CountUp } from "../components/ui/CountUp";
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

export default function ServicePage({ service }: { service: ServiceKind }) {
  const content = serviceContent[service];
  const serviceCards = content.cards;
  const timelineEvents = content.timeline;
  const navigate = useNavigate();
  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleContact = () => navigate("/contact");

  const { isSmallScreen, prefersReducedMotion, isMobile } = useClientEnv();
  const disableTilt = isSmallScreen || isMobile || prefersReducedMotion;
  const STAR_COUNT = isSmallScreen ? 12 : 48;
  const topSpacerHeight = 0;
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
  }, [service]);

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
    <div className="marketing-page relative z-10 min-h-screen text-white">
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
            className="mb-5 tracking-wide"
            style={{
              fontSize: "clamp(2rem, 5vw, 5.5rem)",
              lineHeight: 1.05,
              paddingInline: "1.25rem",
              maxWidth: "100%",
              textTransform: "uppercase",
              color: "transparent",
              backgroundImage: "linear-gradient(90deg, #1BA3FF 0%, #0052FF 52%, #5A00FF 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
          >
            {content.title}
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
                  "linear-gradient(90deg, rgba(81,21,140,0.28) 0%, rgba(124,58,237,0.95) 50%, rgba(81,21,140,0.28) 100%)",
                boxShadow: "0 0 28px rgba(81, 21, 140, 0.9), 0 0 60px rgba(124, 58, 237, 0.65)",
                filter: "drop-shadow(0 0 22px rgba(124, 58, 237, 0.85))",
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
                  "linear-gradient(90deg, rgba(81,21,140,0.18) 0%, rgba(124,58,237,0.35) 50%, rgba(81,21,140,0.18) 100%)",
              }}
            />
          </motion.div>
        </div>
      </section>
 
 {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: 'easeOut' }}
            className="portfolio-subline text-center text-white leading-relaxed"
            style={{
              marginTop: '-2.8rem',
              marginBottom: '1.2rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontSize: 'clamp(0.82rem, 3vw, 1.05rem)',
            }}
          >
            {content.subline}
            <br />
            {content.tagline}
          </motion.p>

        

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
          <motion.h2
            initial={{ opacity: 0, filter: "blur(20px)", y: 30 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
            className="tracking-wide headline-gradient"
            style={{
              fontSize: "clamp(1.4rem, 3vw, 2.8rem)",
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: "transparent",
              marginBottom: "1.25rem",
              marginTop: isSmallScreen ? "-1.2rem" : undefined,
            }}
          >
            {content.heroTitle}
          </motion.h2>
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
              letterSpacing: isSmallScreen ? "0.14em" : "0.22em",
              textTransform: "uppercase",
              maxWidth: "56ch",
              fontSize: isSmallScreen ? "0.72rem" : "clamp(0.9rem, 1.8vw, 1.02rem)",
              textAlign: "center",
            }}
          >
            {content.intro}
          </p>

          <div style={{ marginTop: "2.5rem" }}>
            <div className="contact-footer flex flex-wrap justify-center gap-3">
              <AuroraButton
                label={content.cta}
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
            <span>{content.highlights[0]}</span>
            <span className="opacity-60">•</span>
            <span>{content.highlights[1]}</span>
            <span className="opacity-60">•</span>
            <span>{content.highlights[2]}</span>
          </div>
        </div>

        <div className="hero-img reveal flex flex-col items-center justify-center gap-6" style={{ flex: 1.1, maxWidth: "560px", margin: "0 auto" }}>
          {service === 'production' ? <ProductionVisual /> : service === 'social' ? <SocialMediaVisual /> : <WebsiteVisual />}
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
              marginTop: isSmallScreen ? "-3rem" : "8rem",
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
              {content.servicesTitle}
            </div>
            <div
              className="text-white text-xs md:text-sm tracking-[0.22em] uppercase"
              style={{ marginBottom: "0.2rem" }}
            >
              {content.servicesSubline}
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
                        buttonHref={card.href ?? "/contact"}
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
              marginBottom: "-4rem",
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
              {content.processTitle}
            </h2>
          </div>
          <ScrollTimeline
            subtitle={content.processSubtitle}
            events={timelineEvents}
            finalCard={content.finalCard}
            ctaSlot={
              <div
                className="contact-footer"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  margin: "-1rem auto 0rem",
                  gap: "1rem",
                }}
              >
                <AuroraButton
                  label={content.cta}
                  className="px-8 sm:px-12 py-3.5 text-sm sm:text-base tracking-[0.28em] timeline-cta-button"
                  onClick={handleContact}
                />
              </div>
            }
          />
        </div>
      </section>

      <CollaborateSection
        id="work-with-me"
        portrait={service === 'production' ? 'gimbal' : service === 'social' ? 'controller' : 'seated'}
        intro={content.whyTitle}
        detail={content.whyText}
        caption={service === 'production' ? 'Louis Kuschnir · Filmmaker & audiovisual creator' : service === 'social' ? 'Louis Kuschnir · Content creation & social media management' : 'Louis Kuschnir · Your partner for website design & development'}
      />

      {/* GOOGLE REVIEWS (copied from About) */}
      <section
        className="reveal"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0 10% 4rem",
          marginTop: "-1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.4rem",
            textAlign: "center",
          }}
        >
          <div className="flex w-full justify-center">
            <div
              className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 px-4 py-1.2 text-[0.52rem] sm:text-[0.6rem] font-semibold uppercase tracking-[0.1em] sm:tracking-[0.16em] text-white shadow-[0_0_26px_rgba(124,58,237,0.95),0_0_46px_rgba(56,189,248,0.65)] backdrop-blur-xl"
              style={{
                letterSpacing: '0.12em',
                padding: '0.56rem 1.3rem',
                boxShadow: '0 0 8px rgba(124, 58, 237, 0.68), 0 0 14px rgba(56, 189, 248, 0.46)',
              }}
            >
              <CountUp
                value={88}
                suffix="+"
                duration={8}
                animationStyle="default"
                easing="easeInOut"
                triggerOnView
                colorScheme="gradient"
                className="text-[0.58rem] sm:text-[0.7rem] font-semibold tracking-[0.14em]"
                numberClassName="mx-1"
              />
              <span
                className="ml-2 text-[0.44rem] tracking-[0.1em] sm:text-[0.56rem] sm:tracking-[0.14em]"
                style={{ whiteSpace: "nowrap" }}
              >
                Brands Supported
              </span>
            </div>
          </div>
          <p
            className="mt-0 text-center text-white/80"
            style={{
              textTransform: "uppercase",
              fontSize: "0.7rem",
              letterSpacing: "0.14em",
            }}
          >
            <span className="block sm:inline">{content.highlights[0]}</span>
            <span className="hidden sm:inline">&nbsp;•&nbsp;</span>
            <span className="block sm:inline">{content.highlights[1]}</span>
            <span className="hidden sm:inline">&nbsp;•&nbsp;</span>
            <span className="block sm:inline">{content.highlights[2]}</span>
          </p>

          <div className="flex justify-center items-center" style={{ marginTop: "0.75rem" }}>
            <div
              className="h-[2px] w-[280px] rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(81,21,140,0.18) 0%, rgba(124,58,237,0.95) 50%, rgba(81,21,140,0.18) 100%)",
                boxShadow: "0 0 20px rgba(124, 58, 237, 0.9)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2.5rem",
            }}
          >
            <div
              className="rounded-2xl backdrop-blur-xl p-7 text-center review-card heavy-blur card-hover"
              style={{
                flex: "1 1 280px",
                maxWidth: "420px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(90,0,255,0.25)",
                boxShadow: "0 0 25px rgba(90,0,255,0.25)",
                padding: "1rem",
                transform: "translateY(0) scale(1)",
                transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 0 28px rgba(56,189,248,0.45)";
                e.currentTarget.style.border = "1px solid rgba(56,189,248,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(90,0,255,0.25)";
                e.currentTarget.style.border = "1px solid rgba(90,0,255,0.25)";
              }}
            >
              <div className="text-lg">✨✨✨✨✨</div>
              <p className="text-white/90 text-sm leading-relaxed italic">
                "Louis elevated our entire brand. Cinematic content, clean strategy, and a funnel that finally converts. We saw an immediate lift in engagement and sales.”
              </p>
              <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">— HIRYZE</p>
            </div>

            <div
              className="rounded-2xl backdrop-blur-xl p-7 text-center review-card heavy-blur card-hover"
              style={{
                flex: "1 1 280px",
                maxWidth: "420px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(90,0,255,0.25)",
                boxShadow: "0 0 25px rgba(90,0,255,0.25)",
                padding: "1rem",
                transform: "translateY(0) scale(1)",
                transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 0 28px rgba(56,189,248,0.45)";
                e.currentTarget.style.border = "1px solid rgba(56,189,248,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(90,0,255,0.25)";
                e.currentTarget.style.border = "1px solid rgba(90,0,255,0.25)";
              }}
            >
              <div className="text-lg">✨✨✨✨✨</div>
              <p className="text-white/90 text-sm leading-relaxed italic">
                “Our website, branding, and ads now feel aligned and premium. Inquiries doubled within weeks. Louis delivered far beyond expectations..”
              </p>
              <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">— FERDINAND DEUBER</p>
            </div>

            <div
              className="rounded-2xl backdrop-blur-xl p-7 text-center review-card heavy-blur card-hover"
              style={{
                flex: "1 1 280px",
                maxWidth: "420px",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(90,0,255,0.25)",
                boxShadow: "0 0 25px rgba(90,0,255,0.25)",
                padding: "1rem",
                transform: "translateY(0) scale(1)",
                transition: "transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px) scale(1.02)";
                e.currentTarget.style.boxShadow = "0 0 28px rgba(56,189,248,0.45)";
                e.currentTarget.style.border = "1px solid rgba(56,189,248,0.8)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0) scale(1)";
                e.currentTarget.style.boxShadow = "0 0 25px rgba(90,0,255,0.25)";
                e.currentTarget.style.border = "1px solid rgba(90,0,255,0.25)";
              }}
            >
              <div className="text-lg">✨✨✨✨✨</div>
              <p className="text-white/90 text-sm leading-relaxed italic">
                “Louis rebuilt our messaging and campaigns from the ground up. More qualified leads, stronger presence, real growth. Highly recommended.”
              </p>
              <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">— ALEXANDER DANNER</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <div
              className="inline-flex flex-col items-center justify-center rounded-full border border-white/30 bg-white/15 px-9 py-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_0_26px_rgba(124,58,237,0.95),0_0_46px_rgba(56,189,248,0.65)] backdrop-blur-xl"
              style={{
                marginTop: '0.75rem',
                padding: '0.56rem 1.3rem',
                boxShadow: '0 0 8px rgba(124, 58, 237, 0.68), 0 0 14px rgba(56, 189, 248, 0.46)',
              }}
            >
              <div className="flex items-center justify-center gap-3 mb-1">
                <span className="text-xs leading-none tracking-[0.2em]">★★★★★</span>
                <CountUp
                  value={5}
                  decimals={1}
                  duration={3}
                  easing="easeInOut"
                  animationStyle="default"
                  colorScheme="gradient"
                  className="text-[0.84rem] font-semibold tracking-[0.24em]"
                  numberClassName=""
                />
              </div>
              <span className="text-[0.62rem] tracking-[0.22em] text-white/90">RATING ON GOOGLE MAPS</span>
            </div>
            <a
              href="https://www.google.com/maps/place/COSMICLUCID+CREATIONS/@49.1267538,9.8136859,17z/data=!4m8!3m7!1s0x47985b5e0ece8847:0x39690efa870e1601!8m2!3d49.1267538!4d9.8162608!9m1!1b1!16s%2Fg%2F11xp0g25h9?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 uppercase transition-colors"
              style={{
                color: "#00c3ff",
                letterSpacing: "0.35em",
                fontSize: "0.82rem",
                textDecoration: "none",
              }}
            >
              READ MORE GOOGLE REVIEWS • LEAVE YOURS
              <span aria-hidden style={{ fontSize: "1rem", lineHeight: 1 }}>↗</span>
            </a>
          </div>
        </div>
      </section>

      <section
        className="flex justify-center px-6"
        style={{ margin: "2rem auto 3rem" }}
      >
        <AuroraButton
          label="BRING YOUR VISION TO LIFE"
          className="vision-btn px-12 sm:px-16 py-5 text-lg tracking-[0.3em]"
          onClick={handleContact}
        />
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
            0% { transform: translateY(15rem) scale(0.98); filter: blur(12px); }
            50% { transform: translateY(15rem) scale(1.02); filter: blur(18px); }
            100% { transform: translateY(15rem) scale(0.98); filter: blur(12px); }
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
            inset: -6%;
            border-radius: 100%;
            opacity: var(--aura-opacity);
            pointer-events: none;
            mix-blend-mode: screen;
            z-index: -1;
            background:
              radial-gradient(circle at var(--aura-x) var(--aura-y),
                rgba(16, 203, 255, 0.6),
                rgba(37, 99, 235, 0.42),
                rgba(124, 58, 237, 0.32),
                transparent 70%);
            filter: blur(16px);
            transition: opacity 0.2s ease;
            animation: about-aura-flare 5s ease-in-out infinite;
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
    </div>
  );
}
