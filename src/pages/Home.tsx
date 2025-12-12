import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AuroraButton from '../components/ui/AuroraButton';
import { useClientEnv } from '../hooks/useClientEnv';
import { useNavigate } from 'react-router-dom';
import { UniverseCard } from '../components/UniverseCard';

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
          const rx = (0.5 - next.y) * 6; // reduced tilt range for smoother motion
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
      style={{ perspective: '1000px' }}
      className="will-change-transform"
    >
      <motion.div
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateX: rot.rx, rotateY: rot.ry }}
        transition={{ type: 'spring', stiffness: 140, damping: 14, mass: 0.6 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default function Home() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const { isSmallScreen, isMobile, prefersReducedMotion } = useClientEnv();
  const disableTilt = isSmallScreen || isMobile || prefersReducedMotion;
  const [preloadCards, setPreloadCards] = useState(false);

  // Preload UniverseCards offscreen to avoid any first-click lag
  useEffect(() => {
    const id =
      'requestIdleCallback' in window
        ? (window as any).requestIdleCallback(() => setPreloadCards(true))
        : window.setTimeout(() => setPreloadCards(true), 150);
    return () => {
      if ('cancelIdleCallback' in window) {
        (window as any).cancelIdleCallback(id);
      } else {
        clearTimeout(id as any);
      }
    };
  }, []);

  const handleEnterCosmos = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      const servicesSection = document.getElementById('services');
      servicesSection?.scrollIntoView({ behavior: 'smooth' });

      setTimeout(() => setIsTransitioning(false), 1000);
    }, 300);
  };

  return (
    <>
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={isTransitioning ? { opacity: 1, scale: 3 } : { opacity: 0, scale: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 z-50 bg-gradient-radial from-white via-purple-200 to-transparent pointer-events-none"
        />

        <div className="hero-content relative z-10 text-center px-8 max-w-5xl -mt-[12vh]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-radial from-[#51158C]/35 via-[#182E6F]/20 to-transparent blur-3xl pointer-events-none" />

          <div className="relative">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="hero-headline mb-6 tracking-tight headline-gradient"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: 'transparent',
              }}
            >
              AUDIOVISUAL PRODUCTION & ENERGETIC FITNESS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1, ease: 'easeOut' }}
              className="hero-subtitle text-white/70 leading-relaxed mx-auto"
              style={{
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                maxWidth: '56ch',
                fontSize: '1.2rem',
                marginBottom: '3rem',
              }}
            >
              WHERE ART, FREQUENCY, AND CONSCIOUSNESS MERGE INTO MOTION.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.4, ease: 'backOut' }}
              className="hero-cta-row flex gap-6 justify-center items-center flex-wrap"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <AuroraButton
                  label="ENTER THE COSMOS"
                  className="px-10 sm:px-12 py-4 text-base tracking-[0.3em]"
                  onClick={() => handleEnterCosmos()}
                />
              </motion.div>

            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.5 }}
          className="hero-scroll absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-white/60 cursor-pointer"
          onClick={handleEnterCosmos}
        >
          <span className="text-sm tracking-wider uppercase">Scroll to Explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
          style={{
            height: '18vh',
            minHeight: '120px',
            maxHeight: '240px',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            background:
              'linear-gradient(to bottom, rgba(140, 82, 255, 0.0) 0%, rgba(140, 82, 255, 0.12) 35%, rgba(12, 12, 35, 0.55) 100%)',
            maskImage: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 65%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 65%)',
          }}
        />
      </section>

      <section id="services" className="relative py-40 px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-10">
          <div
            className="w-full h-full backdrop-blur-[2px]"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
              opacity: 0.4,
            }}
          />
        </div>
        <motion.div
          className="absolute top-[10rem] left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-gradient-radial from-[#51158C]/20 via-[#182E6F]/30 to-transparent blur-[120px] opacity-60 pointer-events-none"
          animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.05, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute -top-10 left-0 right-0 h-40 z-20 pointer-events-none">
          <div
            className="w-full h-full backdrop-blur-[20px]"
            style={{
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)',
              opacity: 0.7,
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-transparent pointer-events-none" />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[1000px] bg-gradient-radial from-[#51158C]/20 via-[#182E6F]/10 to-transparent blur-[100px] opacity-50" />

        <div className="relative z-10 max-w-[1440px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center mb-24"
          >
            <h2
              className="text-white mb-5 tracking-wide glow-text"
              style={{ fontSize: 'clamp(2.5rem, 2.5vw, 2.5rem)', lineHeight: 1.05 }}
            >
              CHOOSE YOUR COSMOS
            </h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '444px' }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
              className="mt-8 mx-auto h-[2px] bg-gradient-to-r from-transparent via-[#51158C] to-transparent"
              style={{
                boxShadow: '0 0 10px rgba(81, 21, 140, 0.8)',
              }}
            />
          </motion.div>

          <div className="flex flex-wrap justify-center gap-10 items-stretch">
            <div className="flex flex-col items-center">
              <motion.h3
                className="text-white/90 text-lg tracking-[0.25em] uppercase mb-6 glow-text"
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: [0.9, 1, 0.9],
                        scale: [1, 1.02, 1],
                        textShadow: [
                          '0 0 12px rgba(64, 128, 255, 0.6), 0 0 24px rgba(64, 128, 255, 0.4)',
                          '0 0 18px rgba(64, 128, 255, 0.7), 0 0 32px rgba(64, 128, 255, 0.5)',
                          '0 0 12px rgba(64, 128, 255, 0.6), 0 0 24px rgba(64, 128, 255, 0.4)',
                        ],
                      }
                }
                transition={{ duration: 3, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                style={{
                  textShadow: '0 0 12px rgba(64, 128, 255, 0.8)',
                }}
              >
                CREATION
              </motion.h3>
              <Tilt disabled={disableTilt}>
                <div
                  className="relative mb-10 rounded-3xl"
                  style={{ transform: 'translateX(0px) translateY(0px)' }}
                >
                  <div className="relative z-10">
                    <UniverseCard
                      icon={<span>🎥</span>}
                      title="COSMICLUCID PRODUCTION"
                      description="Audiovisual production and creative marketing for conscious brands and artists."
                      buttonText="View Portfolio"
                      buttonHref="/portfolio"
                      glowColor="blue"
                      delay={0.2}
                      tilt="left"
                    />
                  </div>
                </div>
              </Tilt>
            </div>

            <div className="flex flex-col items-center">
              <motion.h3
                className="text-white/90 text-lg tracking-[0.25em] uppercase mb-6 glow-text"
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: [0.9, 1, 0.9],
                        scale: [1, 1.02, 1],
                        textShadow: [
                          '0 0 12px rgba(255, 215, 0, 0.6), 0 0 24px rgba(255, 215, 0, 0.4)',
                          '0 0 18px rgba(255, 215, 0, 0.7), 0 0 32px rgba(255, 215, 0, 0.5)',
                          '0 0 12px rgba(255, 215, 0, 0.6), 0 0 24px rgba(255, 215, 0, 0.4)',
                        ],
                      }
                }
                transition={{ duration: 3, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                style={{
                  textShadow: '0 0 12px rgba(255, 215, 0, 0.8)',
                }}
              >
                MENTORING
              </motion.h3>
              <Tilt disabled={disableTilt}>
                <div className="relative mb-10 rounded-3xl" style={{ transform: 'translateX(0px) translateY(0px)' }}>
                  <div className="relative z-10">
                    <UniverseCard
                      icon={<span>🧘‍♂️</span>}
                      title="LUCID MENTORING"
                      description="A single mentorship portal combining energetic coaching and conscious strategy — for creators, founders, and athletes who want aligned performance."
                      buttonText="Explore Mentoring"
                      buttonHref="/mentoring"
                      glowColor="gold"
                      delay={0.35}
                      tilt="center"
                    />
                  </div>
                </div>
              </Tilt>
            </div>

            <div className="flex flex-col items-center">
              <motion.h3
                className="text-white/90 text-lg tracking-[0.25em] uppercase mb-6 glow-text"
                animate={
                  prefersReducedMotion
                    ? { opacity: 1, scale: 1 }
                    : {
                        opacity: [0.9, 1, 0.9],
                        scale: [1, 1.02, 1],
                        textShadow: [
                          '0 0 12px rgba(173, 128, 255, 0.6), 0 0 24px rgba(173, 128, 255, 0.4)',
                          '0 0 18px rgba(173, 128, 255, 0.7), 0 0 32px rgba(173, 128, 255, 0.5)',
                          '0 0 12px rgba(173, 128, 255, 0.6), 0 0 24px rgba(173, 128, 255, 0.4)',
                        ],
                      }
                }
                transition={{ duration: 3, repeat: prefersReducedMotion ? 0 : Infinity, ease: 'easeInOut' }}
                style={{
                  textShadow: '0 0 12px rgba(173, 128, 255, 0.8)',
                }}
              >
                AMPLIFICATION
              </motion.h3>
              <Tilt disabled={disableTilt}>
                <div
                  className="relative mb-10 rounded-3xl"
                  style={{ transform: disableTilt ? 'translateX(0px) translateY(0px)' : 'translateX(20px) translateY(0px)' }}
                >
                  <div className="relative z-10">
                    <UniverseCard
                      icon={<span>🚀</span>}
                      title="COSMICLUCID MARKETING"
                      description="Cinematic marketing systems, launch strategy, and performance creative to scale conscious brands."
                      buttonText="View Marketing"
                      buttonHref="/portfolio/marketing"
                      glowColor="purple"
                      delay={0.5}
                      tilt="right"
                    />
                  </div>
                </div>
              </Tilt>
            </div>
          </div>
        </div>

        <section
          className="relative z-20 py-48 md:py-56 overflow-visible"
          style={{ paddingTop: '8rem', paddingBottom: '3rem' }}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-48 z-20 bg-gradient-to-b from-black to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 z-20 bg-gradient-to-t from-black to-transparent" />

          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-10 h-80 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6),transparent_70%)]" />

          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-[15] h-52 md:h-64 w-screen -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-black/60 via-[#151535]/70 to-black/60 border border-white/10 backdrop-blur-sm shadow-[0_0_120px_rgba(81,21,140,0.85)]"
          />

          <div className="relative z-20 flex items-center justify-center w-full">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              whileHover={{ scale: 1.06, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className="group relative flex items-center justify-center w-full"
            >
              <AuroraButton
                label="BRING YOUR VISION TO LIFE"
                className="px-12 sm:px-16 py-6 text-lg tracking-[0.32em] font-extrabold vision-btn"
                onClick={() => navigate('/contact')}
              />

              <motion.span
                aria-hidden
                className="pointer-events-none absolute -inset-y-32 -inset-x-12 rounded-full bg-gradient-to-r from-[#182E6F] to-[#51158C] blur-[220px] opacity-80"
                animate={{ opacity: [0.55, 0.9, 0.55], scale: [0.95, 1.08, 0.95] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          </div>
        </section>
      </section>

      {preloadCards && (
        <div
          aria-hidden
          className="preload-universe-cards"
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', height: 0, overflow: 'hidden' }}
        >
          <UniverseCard
            icon={<span>🎥</span>}
            title="COSMICLUCID PRODUCTION"
            description="Audiovisual production and creative marketing for conscious brands and artists."
            buttonText="View Portfolio"
            buttonHref="/portfolio"
            glowColor="blue"
            delay={0}
            tilt="left"
          />
          <UniverseCard
            icon={<span>🧘‍♂️</span>}
            title="LUCID MENTORING"
            description="One mentorship portal blending energetic coaching and conscious strategy."
            buttonText="Explore Mentoring"
            buttonHref="/mentoring"
            glowColor="gold"
            delay={0}
            tilt="center"
          />
          <UniverseCard
            icon={<span>🚀</span>}
            title="COSMICLUCID MARKETING"
            description="Cinematic marketing systems, launch strategy, and performance creative to scale conscious brands."
            buttonText="View Marketing"
            buttonHref="/portfolio/marketing"
            glowColor="purple"
            delay={0}
            tilt="right"
          />
        </div>
      )}
    </>
  );
}
