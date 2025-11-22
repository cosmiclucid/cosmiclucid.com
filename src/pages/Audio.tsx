import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { PortfolioCard } from '../components/PortfolioCard';
import AuroraButton from '../components/ui/AuroraButton';
import GlowNav from '../components/ui/GlowNav';
import { VideoText } from '../components/ui/VideoText';
import { CountUp } from '../components/ui/CountUp';

const categories = [
  {
    id: 'music',
    icon: null,
    title: 'MUSIC',
    subline: 'ORIGINAL MUSIC PRODUCTIONS & MUSIC VIDEOS',
    description:
      '— I create high-vibration music and sound journeys designed to move bodies, open hearts, and support deeper states of focus, training, and self-awareness through lucidity. —',
    color: 'purple' as const,
    delay: 0.15,
    videoIds: [
      'https://www.youtube.com/watch?v=op5NXUMrijI',
      'https://www.youtube.com/watch?v=BPqTFAAC2Sc',
    ],
  },
  {
    id: 'sound-design',
    icon: null,
    title: 'SOUND DESIGN',
    subline: 'ENERGETIC SOUND DESIGN FOR IMPACTFUL STORYTELLING',
    description:
      '— I create cinematic atmospheres, detailed sound effects, and immersive audio crafted to amplify emotion, depth, and visual storytelling for films, brands, and creators. —',
    color: 'cyan' as const,
    delay: 0.35,
    videoIds: [
      'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
      'https://www.youtube.com/watch?v=FTQbiNvZqaY',
    ],
  },
  {
    id: 'cosmic-concerts',
    icon: null,
    title: 'COSMIC CONCERTS',
    subline: 'Techno & trance sets that move bodies and elevate rooms worldwide.',
    description: '',
    color: 'gold' as const,
    delay: 0.55,
    videoIds: [
      'https://www.youtube.com/watch?v=ZZ5LpwO-An4',
      'https://www.youtube.com/watch?v=R7uC5m-IRns',
    ],
  },
];

export default function Audio() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = useMemo(() => ['all', ...categories.map((cat) => cat.id)], []);
  const activeIndex = filters.indexOf(activeFilter);
  const navItems = useMemo(
    () =>
      filters.map((filter) => {
        const category = categories.find((cat) => cat.id === filter);
        return {
          id: filter,
          label: filter === 'all' ? 'ALL' : category?.title ?? filter,
        };
      }),
    [filters],
  );

  const getYouTubeEmbedSrc = (raw?: string) => {
    if (!raw) return undefined;
    try {
      if (/^https?:\/\//.test(raw)) {
        const u = new URL(raw);
        const v = u.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
        const parts = u.pathname.split('/').filter(Boolean);
        const last = parts[parts.length - 1];
        if (last) return `https://www.youtube.com/embed/${last}`;
      }
    } catch {}
    const id = raw.split('?')[0].split('&')[0];
    return `https://www.youtube.com/embed/${id}`;
  };

  const filteredCategories = useMemo(() => {
    if (activeFilter === 'all') return categories;
    return categories.filter((category) => category.id === activeFilter);
  }, [activeFilter]);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setTimeout(() => {
      setSelectedCategory(null);
    }, 600);
  };

  const getBackgroundGlow = () => {
    switch (hoveredCategory) {
      case 'music':
        return 'from-purple-600/12 via-transparent to-transparent';
      case 'sound-design':
        return 'from-cyan-500/12 via-transparent to-transparent';
      case 'cosmic-concerts':
        return 'from-amber-500/12 via-transparent to-transparent';
      default:
        return 'from-transparent via-transparent to-transparent';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        animate={{ opacity: hoveredCategory ? 0.65 : 0 }}
        transition={{ duration: 0.8 }}
        className={`pointer-events-none fixed inset-0 bg-gradient-radial ${getBackgroundGlow()} blur-3xl`}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={
          selectedCategory
            ? { opacity: 1, scale: 10 }
            : { opacity: 0, scale: 0 }
        }
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="pointer-events-none fixed inset-0 z-50 bg-black"
      />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-8 md:px-16 lg:px-24 xl:px-32 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative flex flex-col items-center text-center"
          style={{ marginTop: '6rem', marginBottom: '4rem' }}
        >
          <motion.div
            className="pointer-events-none absolute -z-10 top-1/2 left-1/2 h-[260px] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-[#51158C]/25 via-[#182E6F]/30 to-transparent blur-[120px] opacity-70"
            animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.07, 1] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.h1
            initial={{ opacity: 0, filter: 'blur(20px)', y: 30 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            className="mb-5 tracking-wide headline-gradient"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: 'transparent',
            }}
          >
            AUDIO
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '420px', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.7, ease: 'easeOut' }}
            className="mx-auto h-[2px] w-full max-w-[460px] rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(81,21,140,0.18) 0%, rgba(124,58,237,0.95) 50%, rgba(81,21,140,0.18) 100%)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.9)',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 text-white text-center leading-relaxed"
            style={{
              marginBottom: '2rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontSize: '1.2rem',
              color: '#ffffff',
            }}
          >
            THE SOUND OF LUCIDITY
          </motion.p>
        </motion.div>

        <div
          className="flex w-full justify-center"
          style={{ marginTop: '2.5rem', marginBottom: '5rem' }}
        >
          <div className="scale-[0.85] origin-center">
            <GlowNav
              className="w-full max-w-[900px]"
              items={navItems}
              activeIndex={activeIndex < 0 ? 0 : activeIndex}
              onSelect={(index) => {
                const next = filters[index];
                if (next) setActiveFilter(next);
              }}
            />
          </div>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-x-16 gap-y-40 px-8 md:px-12 lg:px-16 pt-20 md:grid-cols-2 xl:gap-y-[16rem]">
          {filteredCategories.map((category) => {
            const rawVideoEmbeds = category.videoIds
              ?.map((id) => getYouTubeEmbedSrc(id))
              .filter((src): src is string => Boolean(src));
            const videoEmbedSrcs =
              rawVideoEmbeds && rawVideoEmbeds.length > 0 ? rawVideoEmbeds : undefined;
            const isMusic = category.id === 'music';
            const footerContent =
              category.id === 'music' ? (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-white space-y-8 text-center"
                >
          
                  <div className="mt-12 w-full max-w-6xl mx-auto px-4">
                    {/* Two-column music / production section with buttons */}
                    <div
                      className="flex w-full max-w-4xl mx-auto flex-row flex-wrap items-stretch justify-center"
                      style={{
                        gap: '16rem',
                        marginTop: '1rem',
                        marginBottom: '4rem',
                        paddingLeft: '0rem',
                        paddingRight: '0rem',
                      }}
                    >
                      <div className="flex-1 min-w-[260px] flex flex-col items-center text-center gap-3">
                        <h3 className="text-white text-lg uppercase tracking-[0.22em]">
                          LUCID MUSIC
                        </h3>
                        <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">
                          I create high-vibration music, sound journeys, and energetic beats
                          <br /> designed to move bodies, open hearts, and help you access deeper states
                          <br /> of focus, training, and self-awareness.
                        </p>
                        <AuroraButton
                          label="ENJOY THIS ENERGY"
                          className="px-10 py-5 text-lg tracking-[0.28em]"
                          onClick={() => window.open('https://link.me/cosmiclucid', '_blank')}
                        />
                      </div>

                      <div className="flex-1 min-w-[260px] flex flex-col items-center text-center gap-3">
                        <h3 className="text-white text-lg uppercase tracking-[0.22em]">
                          LUCID PRODUCTION
                        </h3>
                        <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">
                          Through LUCID, I compose original tracks, record vocals, craft cinematic soundscapes,
                          <br /> and offer professional production, mixing, and mastering services
                          <br /> to help artists bring their fullest sonic vision to life.
                        </p>
                        <AuroraButton
                          label="PRODUCE YOUR TRACK"
                          className="px-10 py-5 text-lg tracking-[0.28em]"
                          onClick={() => navigate('/contact')}
                        />
                      </div>
                    </div>

                    {/* TESTIMONIALS SECTION */}
                    <div className="mt-8 mb-4">
                      {/* Badge: 888+ Tracks produced */}
                      <div className="mb-6 flex w-full justify-center">
                        <div
                          className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 px-8 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.32em] text-white shadow-[0_0_26px_rgba(124,58,237,0.95),0_0_46px_rgba(56,189,248,0.65)] backdrop-blur-xl"
                          style={{
                            letterSpacing: '0.3em',
                          }}
                        >
                          <CountUp
                            value={888}
                            suffix="+"
                            duration={8}
                            animationStyle="default"
                            easing="easeInOut"
                            triggerOnView={true}
                            colorScheme="gradient"
                            className="text-[0.9rem] font-semibold tracking-[0.32em]"
                            numberClassName="mx-1"
                          />
                          <span className="ml-3 text-[0.8rem] tracking-[0.32em]">
                            TRACKS PRODUCED
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-center items-center my-6">
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
                          className="rounded-2xl backdrop-blur-xl p-7 text-center"
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
                            “The MIX and MASTER unlocked a depth and clarity I’ve never experienced.
                            LUCID doesn’t just produce — he creates absolute masterpieces. 💫”
                          </p>
                          <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">— KIRIC (ARTIST & FILMMAKER)</p>
                        </div>

                        <div
                          className="rounded-2xl backdrop-blur-xl p-7 text-center"
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
                            “LUCID's sound hits different. It gave me a crazy energy boost.
It’s more than music — it’s a catalyst that pushes you higher into your true potential. ⚡️”
                          </p>
                          <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">— KAZEN (ARTIST)</p>
                        </div>

                        <div
                          className="rounded-2xl backdrop-blur-xl p-7 text-center"
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
LUCID’s production quality competes with top-tier industry tracks — at a fraction of the price. If you want a pro-level mix without a $1,000+ budget, go with LUCID.”
                          </p>
                          <p className="mt-4 text-white text-xs tracking-[0.22em] uppercase">— RYCH (Producer)</p>
                        </div>
                      </div>
                      {/* Google reviews badge + link */}
                      <div className="mt-8 flex flex-col items-center gap-3 text-center">
                        <div
                          className="inline-flex flex-col items-center justify-center rounded-full border border-white/30 bg-white/15 px-8 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_0_26px_rgba(124,58,237,0.95),0_0_46px_rgba(56,189,248,0.65)] backdrop-blur-xl"
                        >
                          <div className="flex items-center justify-center gap-3 mb-1">
                            <span className="text-xs leading-none tracking-[0.2em]">
                              ★★★★★
                            </span>
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
                          <span aria-hidden style={{ fontSize: '1rem', lineHeight: 1 }}>
                            ↗
                          </span>
                        </a>
                      </div>

                      {/* SECRET SOUND – premium frequency offer */}
                      <div className="mt-20 max-w-3xl mx-auto px-6">
                        <div
                          className="relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-white/8 via-black/40 to-black/60 px-8 py-10 md:px-12 md:py-12 backdrop-blur-2xl shadow-[0_0_40px_rgba(90,0,255,0.45)]"
                        >
                          <div className="pointer-events-none absolute inset-0 opacity-40">
                            <div className="absolute -top-20 left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-gradient-radial from-[#B084F5]/40 via-transparent to-transparent blur-3xl" />
                            <div className="absolute -bottom-24 right-0 h-40 w-60 rounded-full bg-gradient-radial from-[#5A00FF]/35 via-transparent to-transparent blur-3xl" />
                          </div>

                          <div className="relative flex flex-col items-center text-center space-y-5">
                            <div style={{ marginTop: '1.5rem', marginBottom: '-3rem', width: '100%', maxWidth: '888px' }}>
                              <VideoText
                                src="/Film/speed.mp4"
                                as="h3"
                                fontSize={44}
                                fontWeight={800}
                                className="w-full h-[120px] overflow-visible"
                              >
                                SECRET SOUND
                              </VideoText>
                            </div>

                            <p
                              className="text-white/90 leading-relaxed"
                              style={{ fontSize: '0.95rem' }}
                            >
                             For my core supporters, I create limited, high-resolution SECRET SOUND files 
                             <br />— CAREFULLY TUNES LUCID FREQUENCIES FOR DEEP FOCUS, TRAINING, HEALING, AND INNER TRANSFORMATION.
<br />Each track is designed to shift your state of consciousness, clear the noise, and align you with your highest energy. 
<br />
<br />These aren’t just any frequencies – they’re tools to reprogram your consciousness on demand.
                            </p>

                            <p
                              className="text-white/70 leading-relaxed"
                              style={{ fontSize: '0.85rem' }}
                            >
                          
                            </p>

                            <div className="pt-4" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                              <AuroraButton
                                label="UNLOCK SECRET SOUND"
                                className="px-12 py-5 text-xs sm:text-sm md:text-base tracking-[0.28em]"
                                onClick={() =>
                                  window.open(
                                    'https://buy.stripe.com/8x214o3t052l4uv0aT1Jm04',
                                    '_blank'
                                  )
                                }
                              />
                            </div>
                            <p
                              className="leading-relaxed mt-3"
                              style={{ fontSize: '0.7rem', color: '#9ca3af' }}
                            >
                              You get 8 LUCID FREQUENCIES plus 4 bonus frequencies as high-quality WAV/MP3 files 
                              <br />(not available on streaming platforms) 
                               <br />that anyone can use to tune their energy into a desired state of consciousness 
                              <br />— and stay LUCID.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              ) : category.id === 'sound-design' ? (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center space-y-5 text-white"
                >
                  <h3 className="text-white text-lg uppercase tracking-[0.22em]">
                    SUPREME SOUND DESIGN
                  </h3>
                  <p className="text-white/85 text-sm leading-relaxed">
                    I craft cinematic soundscapes, atmospheres, and immersive audio experiences for films, brands, commercials, trailers, and storytellers who want their visuals to resonate on a deeper emotional level.
                  </p>
                  <p className="text-white/85 text-sm leading-relaxed">
                    From abstract textures to powerful sound effects, every project receives handcrafted audio that enhances emotion, tension, depth, and storytelling.
                  </p>
                  <div className="flex justify-center pt-2">
                    <AuroraButton
                      label="GET YOUR SUPREME SOUNDDESIGN"
                      className="px-10 py-5 tracking-[0.24em]"
                      onClick={() => navigate('/contact')}
                    />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center space-y-5 text-white"
                >
                  <h3 className="text-white text-lg uppercase tracking-[0.22em]">
                    COSMIC CONCERTS & DJ SETS
                  </h3>
                  <p className="text-white/85 text-sm leading-relaxed">
                    As a DJ and performer, I bring techno, trance, and energetic live sets to clubs, rooftops, festivals, and venues across the world — from Dubai to Vietnam to Germany — always spreading high-frequency energy.
                  </p>
                  <p className="text-white/85 text-sm leading-relaxed">
                    My mission: unite people through rhythm, movement, and cosmic flow. Every set is a journey — a transformation — an activation.
                  </p>
                  <div className="flex justify-center pt-2">
                    <AuroraButton
                      label="BOOK ME FOR YOUR VENUE"
                      className="px-10 py-5 tracking-[0.24em]"
                      onClick={() => navigate('/contact')}
                    />
                  </div>
                </motion.div>
              );
            return (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={`mb-8 p-4 md:mb-12 ${isMusic ? 'md:col-span-2 flex justify-center' : ''}`}
              >
                <PortfolioCard
                  icon={category.icon}
                  title={category.title}
                  description={category.description}
                  subline={'subline' in category ? (category as any).subline : undefined}
                  caption={'caption' in category ? (category as any).caption : undefined}
                  color={category.color}
                  delay={category.delay}
                  videoUrls={videoEmbedSrcs}
                  maxWidthClass={isMusic ? 'max-w-full' : undefined}
                  onClick={
                    videoEmbedSrcs?.length ? undefined : () => handleCategoryClick(category.id)
                  }
                  footerContent={footerContent}
                />
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex w-full justify-center px-6"
          style={{ marginTop: '6rem', marginBottom: '8rem' }}
        >
          <motion.div whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}>
            <AuroraButton
              label="LET'S MAKE MUSIC"
              className="px-12 sm:px-20 py-6 text-lg tracking-[0.32em]"
              onClick={() => navigate('/contact')}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="pointer-events-none fixed top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-purple-600/6 blur-[120px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/6 blur-[120px]" />
    </div>
  );
}
