'use client';

import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { motion } from 'motion/react';
import AuroraButton from '../components/ui/AuroraButton';
import { CountUp } from '../components/ui/CountUp';
import { useClientEnv } from '../hooks/useClientEnv';
import { Link } from 'react-router-dom';
import LouisPortrait from '../components/LouisPortrait';

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

  return (
    <div className="about-page" style={{ position: 'relative', minHeight: '100vh' }}>
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

      <section className="about-introduction" aria-labelledby="about-introduction-title">
        <div className="about-introduction__copy">
          <div className="about-introduction__heading">
            <p className="portrait-eyebrow">The person behind Louis Lucid</p>
            <h1 id="about-introduction-title" className="headline-gradient">I'm Louis Kuschnir</h1>
          </div>
          <div className="about-introduction__body">
          <p className="about-introduction__lead">Your creative partner for audiovisual production, social media and websites.</p>
          <p className="about-introduction__description">I bring ideas to life through film, photography and sound, then connect that content with the places your audience meets you. When we work together, you work directly with me — from the first conversation to the finished project.</p>
          <div className="collaborate-section__actions">
            <AuroraButton label="LET'S WORK TOGETHER" href="/contact" className="px-8 py-4 text-sm tracking-[0.15em]" />
            <Link to="/portfolio">Explore my portfolio <span aria-hidden="true">↗</span></Link>
          </div>
          </div>
        </div>
        <LouisPortrait kind="portrait" eager caption="Louis Kuschnir · Filmmaker, content creator & web designer" />
      </section>

      <section className="about-craft" aria-labelledby="about-craft-title">
        <h2 id="about-craft-title" className="headline-gradient">Hands-on from concept to creation</h2>
        <p>Creative direction meets practical production. These are the tools I use to turn a clear idea into images and stories for your business.</p>
        <div className="about-craft__grid">
          <LouisPortrait kind="gimbalWide" caption="Camera & gimbal · Cinematic movement and visual storytelling" />
          <LouisPortrait kind="drone" caption="Drone filming · A wider perspective on your story" />
        </div>
      </section>

      {/* ---- Section Heading ---- */}
      <div
        className="reveal"
        style={{ textAlign: 'center', marginTop: '0' }}
        id="about-my-story"
      >
        <div className="flex flex-col items-center gap-6">
          <motion.h2
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
          </motion.h2>
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
          FROM MAKING MUSIC TO BUILDING DIGITAL PRESENCES
        </p>
      </div>

      {/* ---- SCROLL TIMELINE ---- */}
      <section className="about-story-timeline" style={{ position: 'relative', zIndex: 1, marginTop: '2rem' }}>
          <Suspense fallback={null}>
        <ScrollTimeline
          subtitle="From my first tracks to your next project"
          events={[
            {
              id: 'music',
              year: '01 · MUSIC',
              title: 'It started with sound',
              description: 'Producing my own music was my first creative outlet. It taught me how to turn an idea into a finished track — and how much the details matter.',
            },
            {
              id: 'film',
              year: '02 · FILM',
              title: 'Giving the music a visual world',
              description: 'I wanted to make my own music videos. That curiosity brought me into camera work, editing and visual storytelling — and grew into a passion for video production.',
            },
            {
              id: 'studies',
              year: '03 · AUDIOVISUAL MEDIA',
              title: 'Turning curiosity into craft',
              description: 'Studying Audiovisual Media gave me a professional foundation across filmmaking, audio production, sound design and web development. I learned to connect the technical and creative sides of a project.',
            },
            {
              id: 'ai',
              year: '04 · AI',
              title: 'Exploring new tools from the start',
              description: 'I began using AI creative tools from their earliest releases. Today, that hands-on experience informs how I create films, music, sound design and websites — choosing the tools that serve each project.',
            },
            {
              id: 'audience',
              year: '05 · SOCIAL MEDIA',
              title: 'Building my own audience',
              description: 'Alongside my studies, I built my own social media brands and grew an audience of over 33,000 followers. Creating for my own channels taught me how strategy, content and consistency work together.',
            },
            {
              id: 'clients',
              year: '06 · CLIENT WORK',
              title: 'Bringing that experience to your business',
              description: 'As more brands reached out, I worked with artists, personal brands, YouTubers and companies. I help them sharpen their positioning and digital presence through audiovisual content, social media and websites — with visibility, client enquiries and revenue as the goals.',
            },
          ]}
          finalCard={{
            title: 'WHAT WE CREATE NEXT',
            subtitle: 'YOUR PROJECT',
            paragraphs: [
              'Today, I bring those disciplines together for your business: audiovisual production, social media management and website design & development.',
              "Tell me what you want to achieve. Let's build the right creative approach together.",
            ],
          }}
          ctaSlot={
            <div
              className="contact-footer"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: '1.2rem auto 0rem',
                gap: '1rem',
              }}
            >
              <AuroraButton
                label="CONNECT WITH ME"
                className="px-10 sm:px-14 py-4 text-base tracking-[0.32em] timeline-cta-button"
                style={{ marginBottom: '7rem' }}
                onClick={() => (window.location.href = '/contact')}
              />
              <div className="mt-12 w-full flex flex-col items-center gap-8 text-center">
                <p
                  className="mt-4 text-center text-white/80"
                  style={{
                    textTransform: 'uppercase',
                    whiteSpace: 'normal',
                    fontSize: '0.7rem',
                    letterSpacing: '0.14em',
                  }}
                >
                  Audiovisual Production • Social Media • Websites
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
                      “Louis created a stunning website and delivered it in a remarkably short time. He was reliable, easy to work with, and the finished result looked fantastic. I couldn’t be happier.”
                    </p>
                    <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">
                      — LUCAS SCHÄFER
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
                  className="inline-flex flex-col items-center justify-center rounded-full border border-white/30 bg-white/15 px-9 py-3.5 text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-white shadow-[0_0_26px_rgba(124,58,237,0.95),0_0_46px_rgba(56,189,248,0.65)] backdrop-blur-xl"
                  style={{
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
                  <span className="text-[0.62rem] tracking-[0.22em] text-white/90">
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
            Currently travelling <strong>All around the World</strong>
            <br />
            — creating from everywhere in the cosmos —
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
        .about-story-timeline .scroll-timeline { margin-top: 2rem; }
        .about-story-timeline .scroll-timeline-item { margin-bottom: 2rem; }
        .about-story-timeline .scroll-timeline-item:first-child { margin-top: 2rem !important; }
        .about-story-timeline .scroll-timeline-final-card { margin-top: 3rem; }
        .about-story-timeline .scroll-timeline-card-text { font-size: 1rem; line-height: 1.7; letter-spacing: 0; hyphens: none; }
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
    </div>
  );
}
