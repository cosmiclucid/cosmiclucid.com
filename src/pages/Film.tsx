import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PortfolioCard } from '../components/PortfolioCard';
import { useNavigate } from 'react-router-dom';
import AuroraButton from '../components/ui/AuroraButton';
import GlowNav from '../components/ui/GlowNav';
import { CountUp } from '../components/ui/CountUp';

const categories = [
  {
    id: 'artists',
    icon: null,
    title: 'ARTISTS',
    subLine: 'ARTISTS, DJS & CREATIVE INDIVIDUALS',
    description:
      '— I capture high-energy moments on stage and transform them into cinematic visuals that define your identity. —',
    salesHeadline: 'ARTISTS',
    selling: 'Transform your stage moments into powerful visuals that build your artistic identity.',
    cta: 'BOOK ARTIST VISUALS',
    shortText: 'Cinematic visuals for artists.',
    badge: 'TRUSTED BY ARTISTS & DJS',
    bullets: [
      { label: 'Artists filmed', value: 120, suffix: '+' },
      { label: 'Fast delivery', value: 250, suffix: '+' },
      { label: 'Cities worldwide', value: 30, suffix: '+' },
    ],
    color: 'purple' as const,
    delay: 0.15,
    videoIds: [
      'https://www.youtube.com/watch?v=BPqTFAAC2Sc&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=1',
      'https://www.youtube.com/watch?v=aSMSqcw3UUE&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=16',
    ],
  },
  {
    id: 'brands',
    icon: null,
    title: 'BRANDS',
    subLine: 'BRANDED CONTENT & COMMERCIAL FILMS',
    description:
      '— I craft modern, cinematic brand visuals that elevate products, services, and stories into premium experiences. —',
    salesHeadline: 'BRANDS',
    selling: 'Elevate your brand with storytelling that builds trust, connects emotionally and converts effortlessly.',
    cta: 'CREATE YOUR BRAND FILM',
    shortText: 'Modern and cinematic brand storytelling.',
    badge: 'TRUSTED BY BRANDS & FOUNDERS',
    bullets: [
      { label: 'Brand campaigns', value: 80, suffix: '+' },
      { label: 'Premium look', value: 140, suffix: '+' },
      { label: 'High conversion impact', value: 25, suffix: '+' },
    ],
    color: 'cyan' as const,
    delay: 0.3,
    videoIds: [
      'https://www.youtube.com/watch?v=W3vKqelgV_M&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=18',
      'https://www.youtube.com/watch?v=dwQQ-DwHLyw&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=4',
    ],
  },
  {
    id: 'events',
    icon: null,
    title: 'EVENTS',
    subLine: 'EVENT FILMS & HIGHLIGHTS',
    description:
      '— I preserve the energy, emotion, and atmosphere of your event through impactful, story-driven visuals. —',
    salesHeadline: 'EVENTS',
    selling: 'Capture the energy, atmosphere, and emotion of your event that feel as powerful as the real thing.',
    cta: 'CAPTURE MY EVENT',
    shortText: 'High-energy event highlights.',
    badge: 'TRUSTED BY ORGANIZERS WORLDWIDE',
    bullets: [
      { label: 'Events filmed', value: 150, suffix: '+' },
      { label: 'Fast delivery', value: 90, suffix: '+' },
      { label: 'High-energy edits', value: 18, suffix: '+' },
    ],
    color: 'magenta' as const,
    delay: 0.6,
    videoIds: [
      'https://www.youtube.com/watch?v=aSMSqcw3UUE&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=16',
      'https://www.youtube.com/watch?v=Uzhbw3YcWcY&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=15',
    ],
  },
  {
    id: 'weddings',
    icon: null,
    title: 'WEDDINGS',
    subLine: 'WEDDING FILMS & CELEBRATIONS',
    description:
      '— I create emotional, timeless wedding films that let you relive your story for a lifetime. —',
    salesHeadline: 'WEDDINGS',
    selling: 'Relive every moment with a wedding film crafted to feel magical every single time.',
    cta: 'BOOK YOUR WEDDING FILM',
    shortText: 'Emotional, cinematic wedding storytelling.',
    badge: 'TRUSTED BY COUPLES WORLDWIDE',
    bullets: [
      { label: 'Wedding films', value: 50, suffix: '+' },
      { label: 'Emotional storytelling', value: 80, suffix: '+' },
      { label: 'Romantic cinematics', value: 20, suffix: '+' },
    ],
    color: 'gold' as const,
    delay: 0.75,
    videoIds: [
      'https://www.youtube.com/watch?v=XRyHbwbO6ZI&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=2',
      'https://www.youtube.com/watch?v=mKHtSbhmf1Q',
    ],
  },
  {
    id: 'music-videos',
    icon: null,
    title: 'MUSIC',
    subLine: 'MUSIC PRODUCTIONS & VISUALIZERS',
    description:
      '— I turn your sound into cinematic worlds — crafted to amplify emotion, identity, and visual impact. —',
    salesHeadline: 'MUSIC',
    selling: 'Bring your music to life with visuals that elevate your sound and define your artistic identity.',
    cta: 'CREATE YOUR MUSIC VIDEO',
    shortText: 'Cinematic visuals that amplify your music.',
    badge: 'TRUSTED BY ARTISTS & LABELS',
    bullets: [
      { label: 'Music videos', value: 25, suffix: '+' },
      { label: 'Unique artistic identity', value: 140, suffix: '+' },
      { label: 'Strong visual style', value: 20, suffix: '+' },
    ],
    color: 'purple' as const,
    delay: 0.45,
    videoIds: [
      'https://www.youtube.com/watch?v=PFDPVj7wT-M&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=3',
      'https://www.youtube.com/watch?v=2D8vSpkX7bY&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=5',
      'https://www.youtube.com/watch?v=op5NXUMrijI&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=19',
    ],
  },
  {
    id: 'short-films',
    icon: null,
    title: 'FILMS',
    subLine: 'FILM PROJECTS & CINEMATIC EXPERIMENTS',
    description:
      '— I produce artistic, meaningful short films that blend emotion, style, and storytelling into powerful expression. —',
    salesHeadline: 'FILMS',
    selling: 'Bring your creative vision to life through aesthetic filmmaking and emotional storytelling.',
    cta: 'CREATE A FILM',
    shortText: 'Artistic cinematic expression.',
    badge: 'TRUSTED BY FILMMAKERS',
    bullets: [
      { label: 'Film projects', value: 45, suffix: '+' },
      { label: 'Artistic pieces', value: 30, suffix: '+' },
      { label: 'Strong visual identity', value: 12, suffix: '+' },
    ],
    color: 'cyan' as const,
    delay: 0.9,
    videoIds: [
      'https://www.youtube.com/watch?v=BPqTFAAC2Sc&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y',
      'https://www.youtube.com/watch?v=WfrPoyAVnF0&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=8',
      'https://www.youtube.com/watch?v=0TiAQ2He40w&list=PLiaJ9onQC8P1jYGX85nY4YqA7oxTPgM-y&index=6',
    ],
  },
];

export default function Film() {
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

  // Clean any query params or full URLs and return a valid embed URL
  const getYouTubeEmbedSrc = (raw?: string) => {
    if (!raw) return undefined;
    // If it's a full URL, try to extract the v= param or last path segment
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
    // If it's a bare id with query (e.g. "BPqTFAAC2Sc?si=...") strip at '?'
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
      case 'artists':
        return 'from-purple-600/12 via-transparent to-transparent';
      case 'brands':
        return 'from-cyan-500/12 via-transparent to-transparent';
      case 'music-videos':
        return 'from-amber-500/12 via-transparent to-transparent';
      case 'events':
        return 'from-pink-600/12 via-transparent to-transparent';
      case 'weddings':
        return 'from-rose-500/12 via-transparent to-transparent';
      case 'short-films':
        return 'from-indigo-500/12 via-transparent to-transparent';
      default:
        return 'from-transparent via-transparent to-transparent';
    }
  };

  return (
    <div className="portfolio-page relative min-h-screen overflow-hidden">
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

      <div className="relative z-10 flex min-h-screen flex-col items-center px-8 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hero-header relative flex flex-col items-center text-center md:mt-20"
          style={{ marginTop: '0.25rem', marginBottom: '0.1rem' }}
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
            className="mb-1 tracking-wide headline-gradient"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5.5rem)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
              color: 'transparent',
              marginTop: '8rem',
            }}
          >
            FILM
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '260px', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.7, ease: 'easeOut' }}
            className="mx-auto h-[2px] w-full max-w-[220px] rounded-full"
            style={{
              background:
                'linear-gradient(90deg, rgba(81,21,140,0.18) 0%, rgba(124,58,237,0.95) 50%, rgba(81,21,140,0.18) 100%)',
              boxShadow: '0 0 20px rgba(124, 58, 237, 0.9)',
              marginTop: '0rem',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-1 text-white text-center leading-relaxed portfolio-subline"
            style={{
              marginTop: '0.3rem',
              marginBottom: '0.45rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontSize: 'clamp(0.82rem, 3vw, 1.05rem)',
              color: '#ffffff',
            }}
          >
            transform your idea into cinematic visuals that move people
            <br />
            — and move your business forward —
          </motion.p>
        </motion.div>

        <div className="flex w-full justify-center" style={{ marginTop: '1rem', marginBottom: '4rem' }}>
          <div className="scale-[0.7] sm:scale-[0.8] origin-center max-w-full">
            <GlowNav
              className="w-full max-w-[720px]"
              items={navItems}
              activeIndex={activeIndex < 0 ? 0 : activeIndex}
              onSelect={(index) => {
                const next = filters[index];
                if (next) setActiveFilter(next);
              }}
            />
          </div>
        </div>

        <div className="grid w-full max-w-6xl grid-cols-1 gap-x-16 gap-y-40 px-6 pt-20 md:grid-cols-2 xl:gap-y-[16rem]">
          {filteredCategories.map((category) => {
            const rawVideoEmbeds = category.videoIds
              ?.map((id) => getYouTubeEmbedSrc(id))
              .filter((src): src is string => Boolean(src));
            const videoEmbedSrcs = rawVideoEmbeds && rawVideoEmbeds.length > 0 ? rawVideoEmbeds : undefined;
            return (
              <div
                key={category.id}
                onMouseEnter={() => setHoveredCategory(category.id)}
                onMouseLeave={() => setHoveredCategory(null)}
                className="p-5"
                style={{ marginBottom: '2.5rem' }}
              >
              <PortfolioCard
                icon={category.icon}
                title={category.title}
                color={category.color}
                delay={category.delay}
                subline={category.subLine}
                description={category.description}
                videoUrls={videoEmbedSrcs}
                onClick={videoEmbedSrcs?.length ? undefined : () => handleCategoryClick(category.id)}
              >
                  <div className="w-full text-center flex flex-col items-center gap-5">
                    <h3 className="text-white text-lg uppercase tracking-[0.18em]" style={{ marginTop: '2rem' }}>
                      {category.subLine}
                    </h3>
                    <p
                      className="text-white/90 text-xs leading-relaxed normal-case tracking-normal"
                      style={{ marginBottom: '2.5rem', marginTop: '0rem' }}
                    >
                      {category.selling}
                    </p>
                    <AuroraButton
                      label={category.cta}
                      className="px-10 py-4 tracking-[0.28em]"
                      onClick={() => navigate('/contact')}
                    />
                    <p className="text-white/70 text-xs tracking-[0.16em]" style={{ marginTop: '0.4rem' }}>
                      {category.shortText}
                    </p>
                    <div
                      className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/15 px-8 py-3 text-[0.75rem] font-semibold uppercase tracking-[0.28em] text-white shadow-[0_0_24px_rgba(124,58,237,0.65),0_0_32px_rgba(56,189,248,0.45)] backdrop-blur-xl"
                      style={{ marginTop: '3.5rem', marginBottom: '0rem' }}
                    >
                      <span className="mr-2 text-base">✨</span>
                      <span>{category.badge}</span>
                    </div>
                    <div className="text-white/70 text-xs leading-relaxed flex flex-col items-center" style={{ marginTop: '0.5rem' }}>
                      <div className="flex flex-wrap justify-center gap-4" style={{ marginBottom: '0.75rem' }}>
                        {category.bullets?.map((bullet, idx) => (
                          <div key={`${category.id}-bullet-${idx}`} className="flex items-center gap-2">
                            {idx === 0 ? (
                              <CountUp
                                value={bullet.value}
                                suffix={bullet.suffix ?? '+'}
                                duration={3}
                                animationStyle="default"
                                easing="easeInOut"
                                triggerOnView={true}
                                colorScheme="gradient"
                                className="text-[0.9rem] font-semibold tracking-[0.18em]"
                                numberClassName="mx-0.5"
                              />
                            ) : (
                              <span>&nbsp;•</span>
                            )}
                            <span>{bullet.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </PortfolioCard>
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
          style={{ marginTop: '4rem', marginBottom: '14rem' }}
        >
          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
          >
            <AuroraButton
              label="BRING YOUR VISION TO LIFE"
              className="vision-btn px-12 sm:px-20 py-6 text-lg tracking-[0.32em]"
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
