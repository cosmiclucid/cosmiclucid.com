'use client';

import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import AuroraButton from '../components/ui/AuroraButton';
import { CountUp } from '../components/ui/CountUp';
import { useClientEnv } from '../hooks/useClientEnv';

const ScrollTimeline = lazy(() =>
  import('../components/ui/ScrollTimeline').then((mod) => ({ default: mod.ScrollTimeline })),
);

type TimelineEntry = {
  id: number;
  title: string;
  subtitle?: string;
  body: string;
  side: 'left' | 'right';
};

const HERO_IMAGE_FILE = 'Louis blau.webp';

function LazyMount({
  children,
  rootMargin = '0px 0px 120px 0px',
  threshold = 0.15,
}: {
  children: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin, threshold },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [rootMargin, threshold]);

  return <div ref={ref}>{visible ? children : null}</div>;
}

export default function About() {
  const { isSmallScreen, isMobile, prefersReducedMotion } = useClientEnv();
  const STAR_COUNT = isSmallScreen ? 12 : 48;
  const topSpacerHeight = isSmallScreen ? 0 : 220;
  const heroTextTransform = isSmallScreen ? 'translateY(0)' : 'translateY(-20rem)';
  // Reveal-on-scroll for any .reveal element
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );
    reveals.forEach(r => observer.observe(r));
    return () => observer.disconnect();
  }, []);

  const heroAuraRef = useRef<HTMLDivElement | null>(null);
  const heroImgStyle = {
    display: 'block',
    width: isSmallScreen ? '100%' : '130%',
    height: 'auto',
    objectFit: 'cover' as const,
    transform: isSmallScreen ? 'translateX(0) translateY(0)' : 'translateX(5%) translateY(-20%)',
    marginTop: isSmallScreen ? '-0.5rem' : '1.25rem',
  };

  // Build a safe public URL that respects Vite's base and encodes spaces/+ correctly
  const HERO_IMG =
    (import.meta as any).env.BASE_URL + 'About/' + encodeURIComponent(HERO_IMAGE_FILE);

  // Pre-generate a small static field of stars for background decoration (no Tailwind)
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
    [STAR_COUNT, prefersReducedMotion],
  );

  useEffect(() => {
    const el = heroAuraRef.current;
    if (!el) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--aura-x', `${x}%`);
      el.style.setProperty('--aura-y', `${y}%`);
      el.style.setProperty('--aura-opacity', '0.9');
    };

    const handlePointerLeave = () => {
      el.style.setProperty('--aura-opacity', '0');
    };

    el.addEventListener('pointermove', handlePointerMove);
    el.addEventListener('pointerenter', handlePointerMove);
    el.addEventListener('pointerleave', handlePointerLeave);

    return () => {
      el.removeEventListener('pointermove', handlePointerMove);
      el.removeEventListener('pointerenter', handlePointerMove);
      el.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);


  return (
    <main className="about-page" style={{ position: 'relative', minHeight: '100vh' }}>
      {/* Top guard spacer to avoid revealing hero top-edge artifact when at scrollTop=0 */}
      <div
        className="about-top-spacer"
        aria-hidden
        style={{ height: `${topSpacerHeight}px`, pointerEvents: 'none' }}
      />
      {/* ---- Cosmic background accents (uses your global colors) ---- */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
        aria-hidden
      >
        {/* Stars */}
        <div style={{ position: 'absolute', inset: 0 }}>
          {stars.map(s => (
            <div
              key={s.id}
              className="star"
              style={{
                position: 'absolute',
                width: 2,
                height: 2,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.9)',
                top: s.top,
                left: s.left,
                opacity: Number(s.opacity),
                animation: prefersReducedMotion ? 'none' : `aboutStarPulse 2.6s ease-in-out ${s.delay} infinite`,
              }}
            />
          ))}
        </div>
      </div>

      {/* ---- HERO ---- */}
      <section className="hero" style={{ position: 'relative', zIndex: 1 }}>
        <div
          className="hero-text reveal"
          style={{ transform: heroTextTransform, textAlign: 'center' }}
        >
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(20px)', y: 30 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="mb-5 tracking-wide headline-gradient"
            style={{
              fontSize: 'clamp(2.3rem, 4.4vw, 4.2rem)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: 'transparent',
            }}
          >
            I'M LOUIS KUSCHNIR
          </motion.h1>
          <div
            className="mt-4 h-[2px] w-full max-w-[320px] relative overflow-visible mx-auto"
            style={{ marginBottom: '1.5rem' }}
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(81,21,140,0.18) 0%, rgba(81,21,140,0.95) 50%, rgba(81,21,140,0.18) 100%)',
                boxShadow: '0 0 24px rgba(81, 21, 140, 1), 0 0 56px rgba(81, 21, 140, 0.55)',
                filter: 'drop-shadow(0 0 20px rgba(81, 21, 140, 0.8))',
                height: '100%',
                borderRadius: '999px',
              }}
            />
            <div
              className="absolute inset-0 rounded-full blur-lg pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(81,21,140,0.1) 0%, rgba(81,21,140,0.4) 50%, rgba(81,21,140,0.1) 100%)',
              }}
            />
          </div>
          <p
            className="text-white/70 leading-relaxed mx-auto about-subline"
            style={{
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              maxWidth: '56ch',
              fontSize: '1.2rem',
              textAlign: 'center',
            }}
          >
            Filmmaker, Creator &amp; Athlete — combining cinematic storytelling,
            physical energy and spiritual awareness to create impact.
          </p>
          <div style={{ marginTop: '2.5rem' }}>
            <div className="contact-footer">
              <AuroraButton
                label="CONTACT ME"
                className="px-10 sm:px-14 py-4 text-base tracking-[0.3em]"
                onClick={() => (window.location.href = '/contact')}
              />
            </div>
          </div>
        </div>

        <div
          className="hero-img reveal"
          ref={heroAuraRef}
          style={{ flex: 1.2, maxWidth: '650px' }}
        >
          <img
            src={HERO_IMG}
            alt="Louis Kuschnir"
            width={520}
            height={640}
            loading="eager"
            decoding="async"
            style={heroImgStyle}
            onError={(e) => {
              console.warn('Hero image failed to load:', HERO_IMG);
              (e.currentTarget as HTMLImageElement).style.outline = '2px solid red';
            }}
          />
        </div>

        <motion.div
          className="about-scroll-cue absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/70 cursor-pointer"
          onClick={() => {
            const target = document.getElementById('about-my-story');
            if (target) {
              const top = target.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top, behavior: 'smooth' });
            }
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          style={{ bottom: '30rem' }}
        >
          <span className="text-xs tracking-[0.4em] uppercase">Scroll to My Story</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* ---- Section Heading ---- */}
      <div
        className="reveal"
        style={{ textAlign: 'center', marginTop: '-4rem' }}
        id="about-my-story"
      >
        <div className="flex flex-col items-center gap-6">
          <motion.h1
            initial={{ opacity: 0, filter: 'blur(20px)', y: 30 }}
            whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="tracking-wide headline-gradient"
            style={{
              margin: 0,
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: 'transparent',
            }}
          >
            MY STORY
          </motion.h1>
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            whileInView={{ width: '420px', opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-[2px] w-full max-w-[420px] relative overflow-visible"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(91,33,182,0.25) 0%, rgba(147,87,255,0.95) 50%, rgba(91,33,182,0.25) 100%)',
                boxShadow: '0 0 28px rgba(147, 87, 255, 0.9), 0 0 60px rgba(91, 33, 182, 0.6)',
                filter: 'drop-shadow(0 0 22px rgba(147, 87, 255, 0.85))',
                height: '100%',
                borderRadius: '999px',
                opacity: 1,
              }}
            />
            <div
              className="absolute inset-0 rounded-full blur-lg pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(91,33,182,0.15) 0%, rgba(147,87,255,0.3) 50%, rgba(91,33,182,0.15) 100%)',
              }}
            />
          </motion.div>
        </div>
        <p
          className="about-subline"
          style={{
            opacity: 0.9,
            marginTop: '1.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
        >
          AND HOW YOU CAN BE PART OF THIS POSITIVE TRANSFORMATION
        </p>
      </div>

      {/* ---- SCROLL TIMELINE ---- */}
      <section style={{ position: 'relative', zIndex: 1, marginTop: '4rem' }}>
        <LazyMount rootMargin="0px 0px 200px 0px">
          <Suspense fallback={null}>
        <ScrollTimeline
          subtitle="SCROLL TO EXPLORE THE COSMIC JOURNEY"
          events={[
            {
              id: '1',
              year: 'Where Everything Began',
              title: 'THE VISION',
              description:
                'My journey began with a clear vision: to bring positive transformation, creativity, and consciousness into this world through art and physical action. I have always believed that creativity is a sacred channel — a way to turn raw energy into something beautiful, constructive, and timeless. Through film, music, and motion, I wanted to inspire people, awaken awareness, and make this dimension a little brighter with every creation. \n🎬 Art became my medium. Energy became my message.',
            },
            {
              id: '2',
              year: 'Why Change Was Needed',
              title: 'THE CONFLICT',
              description:
                'As I explored the creative industry, I realized something deeply unsettling: the same powerful tools of media, sound, and visuals that can uplift humanity were often being used to manipulate, divide, and spread fear. I saw a world flooded with negative energy, disconnection, and overstimulation — people scrolling, but not feeling. That became my challenge: to reconnect humanity through sound, video, frequency, and energy — creating transformation that is both spiritual and physical. \n💫 My mission became clear: to help people feel again — and connect.',
            },
            {
              id: '3',
              year: 'The Birth of COSMICLUCID',
              title: 'THE BEGINNING',
              description:
                'With that mission in my heart, I founded COSMICLUCID — a creative movement dedicated to elevating consciousness through art. It all started with music, learning the language of sound and frequency. Soon after, I expanded into film and photography, becoming an audiovisual creator on a mission to blend emotion, aesthetics, and purpose. Every project became a chance to awaken awareness, motivate transformation, and inspire connection. \n🔮 From sound to vision — COSMICLUCID was born.',
            },
            {
              id: '4',
              year: 'From One to a Collective',
              title: 'THE COSMIC CULTURE',
              description:
                'No great vision thrives alone. Soon, like-minded souls joined the mission — artists, filmmakers, sound designers, and athletes who believed in conscious creation. Together, we built The COSMIC CULTURE — a growing collective fusing art, energy, and purpose to create experiences that move people on every level. Our movement empowers others to step into their own light, reclaim their energy, and co-create a new, more connected reality. \n🌠 COSMICLUCID became more than a brand — it became a culture.',
            },
            {
              id: '5',
              year: 'Growth, Mastery & Impact',
              title: 'THE JOURNEY',
              description:
                'Over the years, I have refined my craft — working with 100+ clients, building impactful brands, and growing an audience of over 50,000 across digital platforms. While completing my Audiovisual Media degree at HdM Stuttgart, I worked in sales and marketing, learning how to position and communicate brands with authenticity and depth. At the same time, my passion for fitness and physical mastery grew — over 10 years of training and coaching taught me how the body fuels creativity and energy flow. These experiences shaped me into a holistic creator — uniting art direction, sound design, branding, and body-mind alignment into one clear philosophy. \n🎯 Art, marketing, and movement — all serving transformation.',
            },
            {
              id: '6',
              year: 'LUCID-BMS System',
              title: 'THE TRANSFORMATION',
              description:
                'By combining all my disciplines, I created the LUCID-BMS System — a transformative process that activates Body, Mind, and Soul through structured practice and creative flow. This system empowers creators, entrepreneurs, and visionaries to align their energy, overcome limitations, and manifest their highest potential — both artistically and personally. \n⚙️ The vision to create positive impact is no longer a dream — it is becoming reality.',
            },
            {
              id: '7',
              year: 'The Vision Expands',
              title: 'THE FUTURE',
              description:
                'And yet, this is only the beginning. COSMICLUCID is evolving into a global creative movement — connecting a Cosmic Culture of artists, athletes, and entrepreneurs who learn to channel energy consciously. The next chapter unfolds through transformational retreats, online academies, digital courses, and immersive audiovisual experiences that unite film, fitness, and self-realization. The goal is clear: to raise the collective vibration of this planet — one creation and one transformation at a time. \n💫 The future is lucid, and its already unfolding.',
            },
          ]}
          finalCard={{
            title: 'THE AWAKENING',
            subtitle: 'FULL LUCID CONSCIOUSNESS',
            titleFontSize: 42,
            titleHeight: 'clamp(45px, 7vw, 80px)',
            titleMarginTop: '-4rem',
            titleMarginBottom: '0rem',
          paragraphs: [
            'From here, the journey becomes ours.',
            'If this story resonated with you —\nif you feel the spark to transform your energy,\nyour craft,\nyour body,\nyour mind,\nyour consciousness —',
            'then you are already part of THE COSMIC CULTURE.',
            'This is your invitation to step into your light,\ncreate with intention,\nand shape a reality where art, frequency,\nand human connection awaken the world.',
            '✨ Let’s create something that transforms energy, minds & souls —\nand bring our shared vision to life.',
          ],
          videoText: {
            src: '/Film/speed.mp4',
            fontWeight: 800,
            fontFamily:
              "var(--font-display, 'Sora', 'Space Grotesk', 'Clash Display', 'Archivo Black', sans-serif)",
            },
          }}
          ctaSlot={
            <div
              className="contact-footer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '0.5rem auto 0rem',
                gap: '1rem',
              }}
            >
              <AuroraButton
                label="CONNECT WITH ME"
                className="px-10 sm:px-14 py-4 text-base tracking-[0.32em] timeline-cta-button"
                style={{ marginBottom: '10rem' }}
                onClick={() => (window.location.href = '/contact')}
              />
              <div className="mt-12 w-full flex flex-col items-center gap-8 text-center">
                <div className="flex w-full justify-center">
                  <div
                    className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 px-8 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_0_26px_rgba(124,58,237,0.95),0_0_46px_rgba(56,189,248,0.65)] backdrop-blur-xl"
                    style={{ letterSpacing: '0.3em' }}
                  >
                    <CountUp
                      value={1111}
                      suffix="+"
                      duration={8}
                      animationStyle="default"
                      easing="easeInOut"
                      triggerOnView={true}
                      colorScheme="gradient"
                      className="text-[0.9rem] font-semibold tracking-[0.32em]"
                      numberClassName="mx-1"
                    />
                    <span className="ml-3 text-[0.8rem] tracking-[0.32em]">Clients Impacted Worldwide</span>
                  </div>
                </div>
                <p
                  className="mt-4 text-xs tracking-[0.28em] text-white/80"
                  style={{ textTransform: 'uppercase' }}
                >
                  🎥 Brand Identity • 💪🏽 Coaching • 🎵 Production
                </p>

                <div className="flex justify-center items-center">
                  <div
                    className="h-[2px] w-[280px] rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, rgba(81,21,140,0.18) 0%, rgba(124,58,237,0.95) 50%, rgba(81,21,140,0.18) 100%)',
                      boxShadow: '0 0 20px rgba(124, 58, 237, 0.9)',
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '2.5rem',
                  }}
                >
                  <div
                    className="rounded-2xl backdrop-blur-xl p-7 text-center review-card heavy-blur card-hover"
                    style={{
                      flex: '1 1 280px',
                      maxWidth: '420px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(90,0,255,0.25)',
                      boxShadow: '0 0 25px rgba(90,0,255,0.25)',
                      padding: '1rem',
                      transform: 'translateY(0) scale(1)',
                      transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 0 28px rgba(56,189,248,0.45)';
                      e.currentTarget.style.border = '1px solid rgba(56,189,248,0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 25px rgba(90,0,255,0.25)';
                      e.currentTarget.style.border = '1px solid rgba(90,0,255,0.25)';
                    }}
                  >
                    <div className="text-lg">✨✨✨✨✨</div>
                    <p className="text-white/90 text-sm leading-relaxed italic">
"Louis completely transformed our brand presence — the visuals, the energy, the storytelling. It felt like he understood our identity better than we did. The result looks premium and unforgettable.”
                    </p>
                    <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">
                      — HIRYZE
                    </p>
                  </div>

                  <div
                    className="rounded-2xl backdrop-blur-xl p-7 text-center review-card heavy-blur card-hover"
                    style={{
                      flex: '1 1 280px',
                      maxWidth: '420px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(90,0,255,0.25)',
                      boxShadow: '0 0 25px rgba(90,0,255,0.25)',
                      padding: '1rem',
                      transform: 'translateY(0) scale(1)',
                      transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 0 28px rgba(56,189,248,0.45)';
                      e.currentTarget.style.border = '1px solid rgba(56,189,248,0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 25px rgba(90,0,255,0.25)';
                      e.currentTarget.style.border = '1px solid rgba(90,0,255,0.25)';
                    }}
                  >
                    <div className="text-lg">✨✨✨✨✨</div>
                    <p className="text-white/90 text-sm leading-relaxed italic">
                      “Working with Louis shifted my entire mindset. His coaching mixes clarity, discipline, and deep emotional awareness — it activated something in me that I didn’t know I had. Total life-upgrade.”
                    </p>
                    <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">
                      — LUCAS SCHÄFERs
                    </p>
                  </div>

                  <div
                    className="rounded-2xl backdrop-blur-xl p-7 text-center review-card heavy-blur card-hover"
                    style={{
                      flex: '1 1 280px',
                      maxWidth: '420px',
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(90,0,255,0.25)',
                      boxShadow: '0 0 25px rgba(90,0,255,0.25)',
                      padding: '1rem',
                      transform: 'translateY(0) scale(1)',
                      transition: 'transform 300ms ease, box-shadow 300ms ease, border-color 300ms ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 0 28px rgba(56,189,248,0.45)';
                      e.currentTarget.style.border = '1px solid rgba(56,189,248,0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0) scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 25px rgba(90,0,255,0.25)';
                      e.currentTarget.style.border = '1px solid rgba(90,0,255,0.25)';
                    }}
                  >
                    <div className="text-lg">✨✨✨✨✨</div>
                    <p className="text-white/90 text-sm leading-relaxed italic">
                     “Every sound Louis creates feels alive. He took my idea, elevated it, and turned it into something cinematic and full of emotion. The mix hits harder than anything I’ve released before.”
                    </p>
                    <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">
                      — KIRIC
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3 text-center">
                  <div
                    className="inline-flex flex-col items-center justify-center rounded-full border border-white/30 bg-white/15 px-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_0_26px_rgba(124,58,237,0.95),0_0_46px_rgba(56,189,248,0.65)] backdrop-blur-xl"
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
                        className="text-[0.9rem] font-semibold tracking-[0.28em]"
                        numberClassName=""
                      />
                    </div>
                    <span className="text-[0.7rem] tracking-[0.28em] text-white/90">
                      RATING ON GOOGLE MAPS
                    </span>
                  </div>
                  <a
                    href="https://www.google.com/maps/place/COSMICLUCID+CREATIONS/@49.1267538,9.8136859,17z/data=!4m8!3m7!1s0x47985b5e0ece8847:0x39690efa870e1601!8m2!3d49.1267538!4d9.8162608!9m1!1b1!16s%2Fg%2F11xp0g25h9?entry=ttu&g_ep=EgoyMDI1MTExNy4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 uppercase transition-colors"
                    style={{
                      color: '#00c3ff',
                      letterSpacing: '0.35em',
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                    }}
                  >
                    READ MORE GOOGLE REVIEWS • LEAVE YOURS
                    <span aria-hidden style={{ fontSize: '1rem', lineHeight: 1 }}>↗</span>
                  </a>
                </div>
              </div>
            </div>
          }
        />
          </Suspense>
        </LazyMount>
      </section>

      {/* ---- Location ---- */}
      <section
        className="reveal"
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 888,
          margin: 'var(--cta-map-gap, 2rem) auto 2rem',
          padding: '1rem',
          textAlign: 'center',
        }}
      >
        <div
          className="scroll-timeline-card no-hover heavy-blur timeline-card"
          style={{
            maxWidth: 960,
            margin: '1rem auto 0',
          }}
        >
          <p
            style={{
              maxWidth: 820,
              margin: '0 auto 24px',
              opacity: 0.9,
              fontFamily:
                "'Space Grotesk', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontSize: '1.2rem',
              lineHeight: 1.6,
            }}
          >
            Currently based near <strong>Stuttgart</strong>
            <br />
            — but creating from everywhere in the cosmos —
          </p>

          <LazyMount rootMargin={isMobile ? '0px 0px 50px 0px' : '0px 0px 200px 0px'}>
            <div
              style={{
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d10443.670206608622!2d9.815018!3d49.126201!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47985b5e0ece8847%3A0x39690efa870e1601!2sCOSMICLUCID%20CREATIONS!5e0!3m2!1sen!2sus!4v1762871463357!5m2!1sen!2sus"
                width="100%"
                height="444"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="COSMICLUCID Location"
              />
            </div>
          </LazyMount>

          <div style={{ marginTop: 18, marginBottom: '4rem', textAlign: 'center' }}>
            <a
              href="https://maps.app.goo.gl/SUkk4AvzbFeVU1Wa6"
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#00c3ffff',
                textDecoration: 'none',
                letterSpacing: '0.35em',
                fontSize: '0.78rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              OPEN IN GOOGLE MAPS
              <span aria-hidden style={{ fontSize: '1rem' }}>↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="reveal"
        style={{
          margin: '6rem auto 8rem',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <AuroraButton
            label="BRING YOUR VISION TO LIFE"
            className="vision-btn px-12 sm:px-16 py-5 text-lg tracking-[0.32em]"
            onClick={() => (window.location.href = '/contact')}
          />
        </motion.div>
      </section>

      {/* Keyframes only for local twinkle animation if not present globally */}
      <style>
        {`
          .about-page {
            /* Removed background to reveal original background */
            /* Other color, gradient, and glow styles remain unchanged elsewhere */
          }
          @keyframes aboutStarPulse {
            0%, 100% { opacity: 0.25; transform: translateY(0); }
            50% { opacity: 1; transform: translateY(-1px); }
          }
        `}
      </style>

      {/* --- CosmicLucid About Page Theming (Visuals Only) --- */}
      <style>
        {`
        /* ABOUT PAGE – COSMIC COLOR REFINEMENT (NO LAYOUT CHANGES) */

        .about-page {
          color: #fff;
        }

        /* Headings and text */
        .about-page h2, 
        .about-page h3 {
          background: linear-gradient(90deg, #00b8ff, #5a00ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .about-page p {
          color: rgba(255,255,255,0.85);
        }

        /* CTA button */
        .about-page .cta-button {
          background: linear-gradient(90deg, #00b8ff, #5a00ff);
          color: #fff;
          box-shadow: 0 0 20px rgba(90,0,255,0.4);
        }
        .about-page .cta-button:hover {
          box-shadow: 0 0 30px rgba(90,0,255,0.6);
          transform: translateY(-2px);
        }

        /* Timeline spine */
        .about-page .timeline::before {
          background: linear-gradient(180deg, rgba(0,184,255,0.6), rgba(90,0,255,0.8));
          filter: drop-shadow(0 0 10px rgba(90,0,255,0.6));
        }

        /* Timeline content boxes */
        .about-page .timeline-content {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(90,0,255,0.25);
          box-shadow: 0 0 25px rgba(90,0,255,0.25);
          backdrop-filter: blur(10px);
        }

        /* Timeline dots */
        .about-page .timeline-dot {
          background: radial-gradient(circle at 50% 50%, #00b8ff 0%, #5a00ff 100%);
          box-shadow: 0 0 20px rgba(90,0,255,0.8);
        }

        /* Reveal animation enhancement */
        .reveal.visible {
          transition: all 0.8s ease;
          filter: drop-shadow(0 0 10px rgba(90,0,255,0.35));
        }
        /* Top spacer sizing for different viewports (visual only, no layout shift) */
        .about-top-spacer { height: 220px; }
        @media (max-width: 768px) { .about-top-spacer { height: 140px; } }
        @media (min-width: 1440px) { .about-top-spacer { height: 260px; } }
        `}
      </style>
    </main>
  );
}
