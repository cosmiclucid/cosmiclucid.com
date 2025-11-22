import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { PortfolioCardPhotography } from '../components/PortfolioCardPhotography';
import { useNavigate } from 'react-router-dom';
import AuroraButton from '../components/ui/AuroraButton';
import GlowNav from '../components/ui/GlowNav';

const portraitRingImages = [
  '/Photography/Portraits/A7404918.webp',
  '/Photography/Portraits/A7404923.webp',
  '/Photography/Portraits/A7404962.webp',
  '/Photography/Portraits/A7406024.webp',
  '/Photography/Portraits/A7407412.webp',
  '/Photography/Portraits/A7407426.webp',
  '/Photography/Portraits/A7407484.webp',
  '/Photography/Portraits/A7407512.webp',
  '/Photography/Portraits/A7407622.webp',
  '/Photography/Portraits/A7407787.webp',
  '/Photography/Portraits/A7407852.webp',
  '/Photography/Portraits/A7407866.webp',
] as const;

const brandRingImages = [
  '/Photography/brands/A7403408.webp',
  '/Photography/brands/A7403431.webp',
  '/Photography/brands/A7403434.webp',
  '/Photography/brands/A7403441-Enhanced-NR.webp',
  '/Photography/brands/A7407490.webp',
  '/Photography/brands/A7407524.webp',
  '/Photography/brands/A7407525.webp',
  '/Photography/brands/A7407526.webp',
  '/Photography/brands/A7407527.webp',
  '/Photography/brands/A7407540.webp',
  '/Photography/brands/A7407542.webp',
  '/Photography/brands/A7407564.webp',
] as const;

const weddingRingImages = [
  '/Photography/weddings/A7405919.webp',
  '/Photography/weddings/A7405923.webp',
  '/Photography/weddings/A7406091.webp',
  '/Photography/weddings/A7406116.webp',
  '/Photography/weddings/A7406132.webp',
  '/Photography/weddings/A7406213.webp',
  '/Photography/weddings/A7406805.webp',
  '/Photography/weddings/A7406838.webp',
  '/Photography/weddings/A7407006.webp',
  '/Photography/weddings/A7407005.webp',
  '/Photography/weddings/A7406955.webp',
  '/Photography/weddings/A7407004.webp',
] as const;

const eventRingImages = [
  '/Photography/events/A7400881-Enhanced-NR.webp',
  '/Photography/events/A7400890-Enhanced-NR.webp',
  '/Photography/events/A7400896-Enhanced-NR.webp',
  '/Photography/events/A7402756-Enhanced-NR.webp',
  '/Photography/events/A7402767-Enhanced-NR.webp',
  '/Photography/events/A7402782-Enhanced-NR.webp',
  '/Photography/events/A7402799-Enhanced-NR.webp',
  '/Photography/events/A7402862-Enhanced-NR.webp',
  '/Photography/events/A7406793.webp',
  '/Photography/events/A7406823.webp',
  '/Photography/events/A7408150-Verbessert-RR.webp',
  '/Photography/events/A7408874-Verbessert-RR.webp',
] as const;

const creativeRingImages = [
  '/Photography/creative-edits/Archangel Michael.webp',
  '/Photography/creative-edits/BTC Cover.webp',
  '/Photography/creative-edits/Elements portrait 1.webp',
  '/Photography/creative-edits/cosmiclucid Banner.webp',
  '/Photography/creative-edits/elektrisch.webp',
  '/Photography/creative-edits/the elements 16-9.webp',
] as const;

const categories = [
  {
    id: 'portraits',
    icon: null,
    title: 'PEOPLE',
    description:
      'I capture portraits and moments as visual stories\n— clean, sharp, and creatively engineered through advanced photography and editing --',
    color: 'magenta' as const,
    delay: 0.15,
    ringImages: portraitRingImages,
  },
  {
    id: 'brands',
    icon: null,
    title: 'BRANDS',
    description:
      'Impactful content for modern brands\n— crafted to stand out, resonate, and convert across digital platforms —',
    color: 'cyan' as const,
    delay: 0.3,
    ringImages: brandRingImages,
  },
  {
    id: 'weddings',
    icon: null,
    title: 'WEDDINGS',
    description:
      'Emotional storytelling of your most sacred day\n— captured with cinematic intimacy, elegance and timeless beauty —',
    color: 'gold' as const,
    delay: 0.45,
    ringImages: weddingRingImages,
  },
  {
    id: 'events',
    icon: null,
    title: 'EVENTS',
    description:
      'Dynamic visual storytelling of live moments, music culture and corporate experiences\n— captured with energy, precision and cinematic flair —',
    color: 'purple' as const,
    delay: 0.6,
    ringImages: eventRingImages,
  },
  {
    id: 'creative',
    icon: null,
    title: 'CREATIVE EDITS',
    description:
      'Experimental visual transformations\n— turning raw footage into surreal, stylized and boundary-breaking art —',
    color: 'magenta' as const,
    delay: 0.75,
    ringImages: creativeRingImages,
  },
];

export default function Photography() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filters = useMemo(() => ['all', ...categories.map((cat) => cat.id)], []);
  const activeIndex = filters.indexOf(activeFilter);
  const navItems = useMemo(
    () =>
      filters.map((filter) => {
        const category = categories.find((cat) => cat.id === filter);
        return {
          id: filter,
          label: (filter === 'all' ? 'ALL' : category?.title ?? filter).toUpperCase(),
        };
      }),
    [filters],
  );

  const filteredCategories = useMemo(() => {
    if (activeFilter === 'all') return categories;
    return categories.filter((category) => category.id === activeFilter);
  }, [activeFilter]);

  const getBackgroundGlow = () => {
    switch (hoveredCategory) {
      case 'portraits':
        return 'from-pink-600/12 via-transparent to-transparent';
      case 'brands':
        return 'from-cyan-500/12 via-transparent to-transparent';
      case 'weddings':
        return 'from-rose-500/12 via-transparent to-transparent';
      case 'events':
        return 'from-purple-600/12 via-transparent to-transparent';
      case 'creative':
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
            PHOTOGRAPHY
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
            }}
          >
            I capture portraits and moments as visual stories
            <br />
            — clean, sharp, and creatively engineered through advanced photography and editing —
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
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="mb-8 p-4 md:mb-12"
            >
              <PortfolioCardPhotography
                icon={category.icon}
                title={category.title}
                description={category.description}
                color={category.color}
                delay={category.delay}
                ringImages={category.ringImages ? [...category.ringImages] : undefined}
              />
            </div>
          ))}
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
