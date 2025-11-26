import { useState } from 'react';
import { motion } from 'motion/react';
import { PortfolioCard } from '../components/PortfolioCard';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import AuroraButton from '../components/ui/AuroraButton';

export default function Portfolio() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();

  const categories = [
    {
      id: 'film',
      icon: <span className="text-6xl">🎥</span>,
      title: 'FILM',
      description: 'Visual storytelling, cinematic reels, brand videos, wedding films, events.',
      color: 'purple' as const,
      path: '/portfolio/film',
      delay: 0.2,
    },
    {
      id: 'photography',
      icon: <span className="text-6xl">📸</span>,
      title: 'PHOTOGRAPHY',
      description: 'Portraits, artistic captures, travel & lifestyle photography.',
      color: 'cyan' as const,
      path: '/portfolio/photography',
      delay: 0.4,
    },
    {
      id: 'audio',
      icon: <span className="text-6xl">🎵</span>,
      title: 'AUDIO',
      description: 'Audio production, original tracks, and performance clips.',
      color: 'gold' as const,
      path: '/portfolio/audio',
      delay: 0.6,
    },
    {
      id: 'marketing',
      icon: <span className="text-6xl">📈</span>,
      title: 'MARKETING',
      description: 'Creative direction, campaigns, and brand storytelling.',
      color: 'magenta' as const,
      path: '/portfolio/marketing',
      delay: 0.8,
    },
  ];

  const handleCategoryClick = (categoryId: string, path: string) => {
    setSelectedCategory(categoryId);
    // Zoom transition effect
    setTimeout(() => {
      navigate(path);
    }, 600);
  };

  // Background tone shift based on hover
  const getBackgroundGlow = () => {
    switch (hoveredCategory) {
      case 'film':
        return 'from-purple-600/10 via-transparent to-transparent';
      case 'photography':
        return 'from-cyan-500/10 via-transparent to-transparent';
      case 'audio':
        return 'from-yellow-500/10 via-transparent to-transparent';
      case 'marketing':
        return 'from-pink-600/10 via-transparent to-transparent';
      default:
        return 'from-transparent via-transparent to-transparent';
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic background glow based on hover */}
      <motion.div
        animate={{
          opacity: hoveredCategory ? 0.6 : 0,
        }}
        transition={{ duration: 0.8 }}
        className={`fixed inset-0 bg-gradient-radial ${getBackgroundGlow()} blur-3xl pointer-events-none`}
      />

      {/* Zoom transition overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={
          selectedCategory
            ? { opacity: 1, scale: 10 }
            : { opacity: 0, scale: 0 }
        }
        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-50 bg-black pointer-events-none"
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start px-8 pt-32 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative text-center mb-20 mt-10 md:mt-20 flex flex-col items-center"
        >
          {/* Subtle cosmic glow behind headline */}
          <motion.div
            className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[260px] bg-gradient-radial from-[#51158C]/25 via-[#182E6F]/30 to-transparent blur-[120px] opacity-70 pointer-events-none"
            animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.07, 1] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Main headline with motion blur entrance */}
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
            PORTFOLIO
          </motion.h1>

          {/* Decorative line */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '520px', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.7, ease: 'easeOut' }}
            className="mt-5 mx-auto h-[2px] w-full max-w-[580px] relative overflow-visible"
          >
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(12,32,110,0.35) 0%, rgba(18,48,140,0.95) 50%, rgba(12,32,110,0.35) 100%)',
                boxShadow: '0 0 28px rgba(18, 48, 140, 0.9), 0 0 60px rgba(12, 32, 110, 0.65)',
                filter: 'drop-shadow(0 0 22px rgba(59, 130, 246, 0.85))',
                height: '100%',
                borderRadius: '999px',
                opacity: 1,
              }}
            />
            <div
              className="absolute inset-0 rounded-full blur-lg pointer-events-none"
              style={{
                background:
                  'linear-gradient(90deg, rgba(12,32,110,0.2) 0%, rgba(18,48,140,0.35) 50%, rgba(12,32,110,0.2) 100%)',
              }}
            />
          </motion.div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.95, ease: 'easeOut' }}
            className="portfolio-subline text-center text-white leading-relaxed"
            style={{
              marginTop: '1rem',
              marginBottom: '1.2rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontSize: 'clamp(0.82rem, 3vw, 1.05rem)',
            }}
          >
            I fuse cinema, sound & strategy into high-impact visual storytelling
            <br />
            — turning ideas into visuals that move people and grow brands —
          </motion.p>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          className="w-full max-w-6xl px-6"
          onClick={() => {
            document.getElementById('portfolio-cards')?.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{ cursor: 'pointer', marginBottom: '2rem', marginTop: '4rem' }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-white/70 cursor-pointer"
            onClick={() => document.getElementById('portfolio-cards')?.scrollIntoView({ behavior: 'smooth' })}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            <span className="text-xs tracking-[0.4em] uppercase">CHOOSE YOUR COSMOS</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Category portals */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-36 xl:gap-x-20 xl:gap-y-40 max-w-6xl w-full mx-auto px-6"
          id="portfolio-cards"
        >
          {categories.map((category) => (
            <div
              key={category.id}
              onMouseEnter={() => setHoveredCategory(category.id)}
              onMouseLeave={() => setHoveredCategory(null)}
              className="p-4 mb-5 md:mb-10"
            >
              <PortfolioCard
                icon={category.icon}
                title={category.title}
                description={category.description}
                color={category.color}
                delay={category.delay}
                onClick={() => handleCategoryClick(category.id, category.path)}
              />
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mt-16 flex w-full justify-center px-6"
          style={{ marginTop: '4rem', marginBottom: '6rem' }}
        >
          <motion.div whileHover={{ scale: 1.04, y: -4 }} whileTap={{ scale: 0.97 }}>
            <AuroraButton
              label="BRING YOUR VISION TO LIFE"
              className="vision-btn px-12 sm:px-16 py-5 text-lg tracking-[0.32em]"
              onClick={() => navigate('/contact')}
            />
          </motion.div>
        </motion.div>

        {/* Footer hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-20 text-white/30 text-xs tracking-widest uppercase"
        >
        </motion.div>
      </div>

      {/* Ambient light effects */}
      <div className="fixed top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
