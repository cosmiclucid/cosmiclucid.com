import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  delay?: number;
  accent?: 'violet' | 'gold';
}

export function ServiceCard({
  icon,
  title,
  description,
  buttonText,
  buttonHref = '#',
  delay = 0,
  accent = 'violet',
}: ServiceCardProps) {
  const isGoldAccent = accent === 'gold';
  const hoverAccentClasses = isGoldAccent
    ? 'hover:border-amber-300/50 hover:shadow-[0_0_42px_rgba(255,215,0,0.32)]'
    : 'hover:border-purple-500/30 hover:shadow-[0_0_40px_rgba(81,21,140,0.3)]';
  const glowOverlayClasses = isGoldAccent
    ? 'bg-gradient-to-br from-[#FACC15]/0 to-[#F59E0B]/0 group-hover:from-[#FACC15]/15 group-hover:to-[#F59E0B]/15'
    : 'bg-gradient-to-br from-[#182E6F]/0 to-[#51158C]/0 group-hover:from-[#182E6F]/10 group-hover:to-[#51158C]/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.03,
        rotateY: 8,
      }}
      className="relative group"
    >
      <div
        className={`relative bg-[#0D001A]/40 backdrop-blur-sm rounded-3xl p-10 h-[450px] w-full max-w-[400px] flex flex-col items-center text-center border border-white/5 transition-all duration-300 ${hoverAccentClasses}`}
      >
        {/* Icon */}
        <div className="mb-6 text-6xl group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>

        {/* Title */}
        <h3 className="text-white mb-4 tracking-wide">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/70 mb-8 flex-grow tracking-wide leading-relaxed">
          {description}
        </p>

        {/* CTA Button */}
        {buttonText && (
          <a
            href={buttonHref}
            className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-[#182E6F] to-[#51158C] text-white tracking-wider uppercase text-sm hover:shadow-[0_0_25px_rgba(81,21,140,0.5)] transition-all duration-300 group-hover:scale-105"
          >
            {buttonText}
          </a>
        )}

        {/* Glow effect on hover */}
        <div
          className={`absolute inset-0 rounded-3xl ${glowOverlayClasses} transition-all duration-300 pointer-events-none`}
        />
      </div>
    </motion.div>
  );
}
