import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { VideoText } from './ui/VideoText';
import SparkleNavbar from './ui/SparkleNavbar';

export function Header() {
  const [fade, setFade] = useState(0); // 0..1
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      const progress = Math.min(1, Math.max(0, y / 180)); // fade in over first ~180px
      setFade(progress);
    };
    handleScroll(); // initialize on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: `linear-gradient(to bottom, rgba(0,0,0,${(0.32 * fade).toFixed(3)}) 0%, rgba(0,0,0,${(0.22 * fade).toFixed(3)}) 60%, rgba(0,0,0,0) 100%)`,
        backdropFilter: `blur(${Math.round(8 * fade)}px)`,
        WebkitBackdropFilter: `blur(${Math.round(8 * fade)}px)`,
      }}
    >
      <div className="site-header__inner max-w-[1440px] mx-auto px-20 h-20 flex items-center justify-between">
        {/* Logo - Home Button */}
        <motion.button
          className="site-logo cursor-pointer transition-all duration-300 uppercase tracking-[0.35em]"
          onClick={() => {
            navigate('/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <VideoText
            src="/Film/speed.mp4"
            className="site-logo-mark h-9 w-[150px]"
            fontSize="clamp(32px, 8vw, 44px)"
            fontWeight={800}
            fontFamily="ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          >
            COSMICLUCID
          </VideoText>
        </motion.button>

        {/* Navigation */}
        <div className="site-nav-container flex items-center">
          <SparkleNavbar
            items={['About', 'Marketing', 'Mentoring', 'Portfolio', 'Contact']}
            color="#5A00FF"
            activeLabel={
              ({
                '/about': 'About',
                '/mentoring': 'Mentoring',
                '/coaching': 'Mentoring',
                '/academy': 'Mentoring',
                '/portfolio/marketing': 'Marketing',
                '/contact': 'Contact',
                '/portfolio': 'Portfolio',
              } as Record<string, string | undefined>)[location.pathname] ?? null
            }
            onItemClick={(_, label) => {
              const routes: Record<string, string> = {
                About: '/about',
                Mentoring: '/mentoring',
                Marketing: '/portfolio/marketing',
                Contact: '/contact',
                Portfolio: '/portfolio',
              };
              const target = routes[label];
              if (target) {
                setTimeout(() => {
                  navigate(target);
                  window.scrollTo({ top: 0, behavior: 'auto' });
                }, 450);
              }
            }}
          />
        </div>
      </div>
    </motion.header>
  );
}
