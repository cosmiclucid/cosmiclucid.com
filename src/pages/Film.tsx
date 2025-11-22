import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PortfolioCard } from '../components/PortfolioCard';
import { useNavigate } from 'react-router-dom';
import AuroraButton from '../components/ui/AuroraButton';
import GlowNav from '../components/ui/GlowNav';

const categories = [
  {
    id: 'artists',
    icon: null,
    title: 'ARTISTS',
    description: '',
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
    description: '',
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
    description: '',
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
    description: '',
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
    title: 'MUSIC VIDEOS',
    description: '',
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
    title: 'SHORT FILMS',
    description: '',
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

      <div className="relative z-10 flex min-h-screen flex-col items-center px-8 pt-32 pb-24">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mb-20 mt-10 flex flex-col items-center text-center md:mt-20"
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
            FILM
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
            transform your idea into cinematic visuals that move people
            <br />
            — and move your business forward —
          </motion.p>
        </motion.div>

        <div className="flex w-full justify-center" style={{ marginTop: '1rem', marginBottom: '4rem' }}>
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
                className="mb-8 p-4 md:mb-12"
              >
                <PortfolioCard
                  icon={category.icon}
                  title={category.title}
                  description={category.description}
                  color={category.color}
                  delay={category.delay}
                  videoUrls={videoEmbedSrcs}
                  onClick={videoEmbedSrcs?.length ? undefined : () => handleCategoryClick(category.id)}
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
          style={{ marginTop: '4rem', marginBottom: '14rem' }}
        >
          <motion.div
            whileHover={{ scale: 1.04, y: -4 }}
            whileTap={{ scale: 0.97 }}
          >
            <AuroraButton
              label="BRING YOUR VISION TO LIFE"
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
