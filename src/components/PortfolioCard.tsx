import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';
import ThreeDImageRing from './lightswind/3D-ImageRing';

interface PortfolioCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  subline?: string;
  caption?: string;
  color: 'purple' | 'cyan' | 'gold' | 'magenta';
  delay?: number;
  onClick?: () => void;
  videoUrls?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  ringImages?: string[];
  footerContent?: ReactNode;
  maxWidthClass?: string;
}

const colorConfig = {
  purple: {
    gradient: 'from-purple-600/18 via-purple-500/8 to-transparent',
    hoverGradient: 'from-purple-500/35 via-purple-600/18 to-transparent',
    border: 'border-purple-500/30',
    hoverBorder: 'border-purple-400/60',
    shadow: 'shadow-[0_0_40px_rgba(168,85,247,0.3)]',
    hoverShadow: 'group-hover:shadow-[0_0_80px_rgba(168,85,247,0.6)]',
    iconColor: 'text-purple-400',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    bgEffect: 'bg-purple-600/5',
    accentCore: {
      background:
        'linear-gradient(90deg, rgba(81,21,140,0.2) 0%, rgba(168,85,247,0.95) 50%, rgba(81,21,140,0.2) 100%)',
      boxShadow: '0 0 22px rgba(168, 85, 247, 0.75)',
    },
    accentGlow: {
      background:
        'linear-gradient(90deg, rgba(168,85,247,0.1) 0%, rgba(168,85,247,0.35) 50%, rgba(168,85,247,0.1) 100%)',
    },
    iconGlow: 'rgba(168, 85, 247, 0.6)',
    iconGlowStrong: 'rgba(168, 85, 247, 0.9)',
  },
  cyan: {
    gradient: 'from-cyan-500/18 via-blue-500/8 to-transparent',
    hoverGradient: 'from-cyan-400/35 via-blue-500/18 to-transparent',
    border: 'border-cyan-500/30',
    hoverBorder: 'border-cyan-400/60',
    shadow: 'shadow-[0_0_40px_rgba(34,211,238,0.3)]',
    hoverShadow: 'group-hover:shadow-[0_0_80px_rgba(34,211,238,0.6)]',
    iconColor: 'text-cyan-400',
    glowColor: 'rgba(34, 211, 238, 0.4)',
    bgEffect: 'bg-cyan-500/5',
    accentCore: {
      background:
        'linear-gradient(90deg, rgba(14,165,233,0.2) 0%, rgba(14,165,233,0.95) 50%, rgba(14,165,233,0.2) 100%)',
      boxShadow: '0 0 22px rgba(14, 165, 233, 0.7)',
    },
    accentGlow: {
      background:
        'linear-gradient(90deg, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0.35) 50%, rgba(14,165,233,0.1) 100%)',
    },
    iconGlow: 'rgba(34, 211, 238, 0.55)',
    iconGlowStrong: 'rgba(34, 211, 238, 0.9)',
  },
  gold: {
    gradient: 'from-yellow-500/18 via-amber-500/8 to-transparent',
    hoverGradient: 'from-yellow-400/35 via-amber-500/18 to-transparent',
    border: 'border-yellow-500/30',
    hoverBorder: 'border-yellow-400/60',
    shadow: 'shadow-[0_0_40px_rgba(251,191,36,0.3)]',
    hoverShadow: 'group-hover:shadow-[0_0_80px_rgba(251,191,36,0.6)]',
    iconColor: 'text-yellow-400',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    bgEffect: 'bg-yellow-500/5',
    accentCore: {
      background:
        'linear-gradient(90deg, rgba(245,158,11,0.18) 0%, rgba(252,211,77,0.95) 50%, rgba(245,158,11,0.18) 100%)',
      boxShadow: '0 0 22px rgba(245, 158, 11, 0.7)',
    },
    accentGlow: {
      background:
        'linear-gradient(90deg, rgba(252,211,77,0.08) 0%, rgba(252,211,77,0.3) 50%, rgba(252,211,77,0.08) 100%)',
    },
    iconGlow: 'rgba(251, 191, 36, 0.55)',
    iconGlowStrong: 'rgba(251, 191, 36, 0.9)',
  },
  magenta: {
    gradient: 'from-pink-600/18 via-fuchsia-500/8 to-transparent',
    hoverGradient: 'from-pink-500/35 via-fuchsia-600/18 to-transparent',
    border: 'border-pink-500/30',
    hoverBorder: 'border-pink-400/60',
    shadow: 'shadow-[0_0_40px_rgba(236,72,153,0.3)]',
    hoverShadow: 'group-hover:shadow-[0_0_80px_rgba(236,72,153,0.6)]',
    iconColor: 'text-pink-400',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    bgEffect: 'bg-pink-600/5',
    accentCore: {
      background:
        'linear-gradient(90deg, rgba(236,72,153,0.18) 0%, rgba(236,72,153,0.95) 50%, rgba(236,72,153,0.18) 100%)',
      boxShadow: '0 0 22px rgba(236, 72, 153, 0.75)',
    },
    accentGlow: {
      background:
        'linear-gradient(90deg, rgba(236,72,153,0.08) 0%, rgba(236,72,153,0.3) 50%, rgba(236,72,153,0.08) 100%)',
    },
    iconGlow: 'rgba(236, 72, 153, 0.55)',
    iconGlowStrong: 'rgba(236, 72, 153, 0.92)',
  },
};

export function PortfolioCard({
  icon,
  title,
  description,
  subline,
  caption,
  color,
  delay = 0,
  onClick,
  videoUrls,
  featuredImage,
  featuredImageAlt,
  ringImages,
  footerContent,
  maxWidthClass = 'max-w-[350px]',
}: PortfolioCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = colorConfig[color];
  const waveOffset = delay * 2;
  const hasVideos = Boolean(videoUrls && videoUrls.length > 0);
  const hasFeaturedImage = Boolean(featuredImage);
  const hasRing = Boolean(ringImages && ringImages.length > 0);
  const hasMedia = hasVideos || hasFeaturedImage || hasRing;
  const titleSpacingClass = hasMedia ? 'mb-4' : 'mb-8';

  const Wrapper: any = onClick ? motion.button : motion.div;
  const wrapperProps = onClick ? ({ type: 'button' as const } as const) : {};

  return (
    <Wrapper
      {...wrapperProps}
      onClick={onClick}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        duration: 1,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.02,
        y: -6,
        transition: { duration: 0.6, ease: [0.25, 0.8, 0.5, 1] },
      }}
      whileTap={{ scale: 0.985 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative w-full ${maxWidthClass} min-h-[400px] perspective-1000`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Main card */}
      <div
        className={`relative h-full rounded-2xl border ${config.border} ${config.hoverBorder} ${config.shadow} ${config.hoverShadow} bg-black/40 backdrop-blur-xl overflow-hidden transition-all duration-700`}
      >
        {/* Animated gradient background */}
        <motion.div
          animate={{
            backgroundPosition: isHovered
              ? ['50% 10%', '50% 90%']
              : ['50% 35%', '50% 65%'],
            backgroundSize: isHovered
              ? ['200% 180%', '206% 186%']
              : ['188% 168%', '196% 176%'],
            opacity: isHovered
              ? [0.35, 0.6]
              : [0.22, 0.42],
          }}
          transition={{
            duration: isHovered ? 6.5 : 9,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: waveOffset,
          }}
          className={`absolute inset-0 bg-gradient-to-b ${isHovered ? config.hoverGradient : config.gradient}`}
          style={{ backgroundSize: '210% 190%', willChange: 'background-position, opacity' }}
        />

        {/* Hover effect overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className={`absolute inset-0 ${config.bgEffect} backdrop-blur-sm`}
        />

        {/* Pulsing glow aura */}
        <motion.div
          animate={
            isHovered
              ? {
                  opacity: [0.32, 0.55],
                  scale: [0.97, 1.05],
                }
              : {
                  opacity: [0.18, 0.38],
                  scale: [0.94, 1.01],
                }
          }
          transition={{
            duration: isHovered ? 5.6 : 8.2,
            repeat: Infinity,
            repeatType: 'mirror',
            ease: 'easeInOut',
            delay: waveOffset + 0.5,
          }}
          className="absolute inset-0 blur-3xl"
          style={{
            background: `radial-gradient(circle at center, ${config.glowColor}, transparent 70%)`,
            willChange: 'transform, opacity',
          }}
        />

        {/* Content */}
        <div
          className="relative z-10 flex h-full w-full flex-col items-center justify-center p-8"
        >
            {/* Icon */}
            <motion.div
  className="mb-8 text-9xl"
  animate={ isHovered ? { rotateY: 360 } : { rotateY: 0 } }
  transition={{
    duration: isHovered ? 6 : 1,
    ease: "easeOut",
    repeat: isHovered ? Infinity : 0,
  }}
  style={{ marginTop: '1.5rem', transformStyle: 'preserve-3d' }}
>
  <span style={{ display: 'inline-block', transform: 'rotate(0deg)' }}>
    {icon}
  </span>
</motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: delay + 0.15, ease: 'easeOut' }}
              className={`text-center ${titleSpacingClass}`}
            >
              <h3
                className="text-white mb-5 tracking-wide glow-text"
                style={{ fontSize: 'clamp(2.5rem, 2.5vw, 2.5rem)', lineHeight: 1.05 }}
              >
                {title}
              </h3>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '240px' }}
                transition={{ duration: 1.2, delay: delay + 0.25, ease: 'easeOut' }}
                className="mt-6 mx-auto h-[2px] relative overflow-visible w-full max-w-[240px]"
              >
                <div
                  className="absolute inset-0 rounded-full"
                  style={config.accentCore}
                />
                <div
                  className="absolute inset-0 rounded-full blur-md pointer-events-none"
                  style={config.accentGlow}
                />
              </motion.div>
            </motion.div>

            {/* Description */}
            {(subline || description) && (
              <div className="mt-4 text-center mb-8">
                {subline && (
                  <h3 className="text-white text-lg uppercase tracking-[0.22em]">
                    {subline}
                  </h3>
                )}
                {description && (
                  <h3
                    className="mt-3 text-white/90 text-xs leading-relaxed normal-case tracking-normal"
                    style={{ marginBottom: '1rem' }}
                  >
                    {description}
                  </h3>
                )}
                {caption && (
                  <div className="text-white text-sm uppercase tracking-[0.18em] leading-relaxed mt-2">
                    {caption}
                  </div>
                )}
              </div>
            )}

            {/* Embedded video */}
            {hasVideos && (
              <div className="mt-4 flex w-full flex-nowrap justify-center gap-3">
                {videoUrls!.map((url, index) => (
                  <div
                    key={`${title}-video-${index}`}
                    className="relative w-full max-w-[120px] overflow-hidden rounded-xl border border-white/10 bg-black/40 shadow-xl"
                    style={{ paddingTop: '25%', minHeight: '80px' }}
                  >
                    <iframe
                      src={url}
                      title={`${title} — YouTube #${index + 1}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                ))}
              </div>
            )}

            {hasFeaturedImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: delay + 0.3, ease: 'easeOut' }}
                className="relative mt-6 w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.45)]"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-80 pointer-events-none" />
                <img
                  src={featuredImage}
                  alt={featuredImageAlt ?? `${title} showcase`}
                  loading="lazy"
                  className="block h-64 w-full object-cover"
                />
              </motion.div>
            )}

            {hasRing && (
              <div className="mt-6 flex w-full justify-center">
                <div className="relative w-full max-w-[320px] h-[320px]">
                  <ThreeDImageRing
                    images={ringImages!}
                    width={320}
                    imageDistance={480}
                    perspective={1300}
                    hoverOpacity={0.55}
                  />
                </div>
              </div>
            )}

            {footerContent && (
              <div className="mt-8 w-full">{footerContent}</div>
            )}

            {/* Enter indicator */}
            {!hasMedia && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isHovered ? 1 : 0,
                  y: isHovered ? -6 : 12,
                }}
                transition={{ duration: 0.3 }}
                className="absolute text-white text-xs tracking-widest uppercase"
                style={{ bottom: '5rem' }}
              >
                Enter the cosmos →
              </motion.div>
            )}
        </div>

        {/* Scan line effect */}
        <motion.div
          animate={{
            y: isHovered ? ['-100%', '200%'] : ['-100%', '-100%'],
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: 'linear',
          }}
          className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </div>

      {/* Outer glow ring */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.5 }}
        className={`absolute inset-0 rounded-2xl border-2 ${config.border} blur-md -z-10`}
      />
    </Wrapper>
  );
}
