import { motion } from 'motion/react';
import { ReactNode } from 'react';
import AuroraButton from './ui/AuroraButton';
import { useClientEnv } from '../hooks/useClientEnv';

type TiltDirection = 'left' | 'center' | 'right';

interface UniverseCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  glowColor: 'blue' | 'purple' | 'violet' | 'gold';
  delay?: number;
  tilt?: TiltDirection;
}

const glowStyles = {
  blue: {
    shadow: '0 0 22px rgba(24, 46, 111, 1), 0 0 40px rgba(24, 46, 111, 0.38)',
    hoverShadow: '0 0 32px rgba(24, 46, 111, 0.72), 0 0 60px rgba(24, 46, 111, 0.34)',
    gradient: 'from-[#182E6F]/30 to-[#182E6F]/10',
    pulseColor: 'rgba(24, 46, 111, 1)',
  },
  purple: {
    shadow: '0 0 22px rgba(81, 21, 140, 0.6), 0 0 40px rgba(81, 21, 140, 0.28)',
    hoverShadow: '0 0 32px rgba(81, 21, 140, 0.7), 0 0 60px rgba(81, 21, 140, 0.35)',
    gradient: 'from-[#51158C]/30 to-[#51158C]/10',
    pulseColor: 'rgba(80, 21, 140, 1)',
  },
  violet: {
    shadow: '0 0 22px rgba(147, 51, 234, 0.6), 0 0 40px rgba(147, 51, 234, 0.28)',
    hoverShadow: '0 0 32px rgba(147, 51, 234, 0.7), 0 0 60px rgba(147, 51, 234, 0.35)',
    gradient: 'from-purple-400/30 to-purple-300/10',
    pulseColor: 'rgba(146, 51, 234, 1)',
  },
  gold: {
    shadow: '0 0 22px rgba(169, 144, 0, 0.6), 0 0 40px rgba(169, 144, 0, 0.28)',
    hoverShadow: '0 0 32px rgba(86, 73, 0, 0.9), 0 0 60px rgba(255, 215, 0, 0.32)',
    gradient: 'from-[#FACC15]/30 to-[#F59E0B]/10',
    pulseColor: 'rgba(100, 87, 0, 1)',
  },
};

export function UniverseCard({  
  icon, 
  title, 
  description, 
  buttonText, 
  buttonHref = '#', 
  glowColor,
  delay = 0,
  tilt = 'left'
}: UniverseCardProps) {
  const { prefersReducedMotion, isSmallScreen, isMobile } = useClientEnv();
  const hoverable = !(prefersReducedMotion || isSmallScreen || isMobile);
  const glow = glowStyles[glowColor];
  const tiltClass =
    tilt === 'center'
      ? 'cosmic-card--center'
      : tilt === 'right'
      ? 'cosmic-card--right'
      : 'cosmic-card--left';

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ 
        duration: 0.9, 
        delay, 
        ease: [0.25, 0.46, 0.45, 0.94] // Smooth easeOutQuad
      }}
      className="relative group perspective-1000 card-hover"
      style={{ willChange: 'transform' }}
    >
      {/* Glassmorphic card */}
      <div 
        className={`cosmic-card ${tiltClass} relative bg-white/[0.03] backdrop-blur-xl rounded-3xl p-10 h-[450px] w-full max-w-[380px] flex flex-col items-center text-center border border-white/10 heavy-blur`}
        style={{
          boxShadow: glow.shadow,
        }}
      >
        {/* Animated gradient background */}
        <div
          className={`cosmic-card__gradient absolute inset-0 rounded-3xl bg-gradient-to-r ${glow.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-700 ease-out`}
        />

        {/* Pulsing glow aura */}
        <div
          className="cosmic-card__aura absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${glow.pulseColor}, transparent 70%)`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center h-full">
          {/* Icon with glow */}
          <div
            className="cosmic-card__icon mb-8 text-7xl transition-transform duration-500 ease-out"
          >
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-white mb-4 tracking-wide uppercase">
            {title}
          </h3>

          {/* Description */}
          <p className="text-white/70 mb-8 flex-grow tracking-wide leading-relaxed">
            {description}
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={hoverable ? { scale: 1.01 } : undefined}
            whileTap={hoverable ? { scale: 0.985 } : undefined}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <AuroraButton
              href={buttonHref}
              label={buttonText}
              className="px-7 py-3.5 text-sm tracking-[0.3em]"
            />
          </motion.div>
        </div>

        {/* Hover glow overlay */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-out pointer-events-none"
          style={{
            boxShadow: glow.hoverShadow,
          }}
        />
      </div>
    </motion.div>
  );
}
