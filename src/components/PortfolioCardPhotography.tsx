import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import ThreeDImageRing from './ui/ThreeDImageRing';

type AccentColor = 'magenta' | 'cyan' | 'gold' | 'purple';

const colorTokens: Record<AccentColor, {
  border: string;
  gradient: string;
  text: string;
  glow: string;
  line: string;
  lineShadow: string;
}> = {
  magenta: {
    border: 'border-pink-500/40',
    gradient: 'from-pink-600/20 via-transparent to-transparent',
    text: 'text-pink-200',
    glow: 'rgba(236,72,153,0.45)',
    line: 'from-transparent via-pink-400/60 to-transparent',
    lineShadow: '0 0 14px rgba(236,72,153,0.6)',
  },
  cyan: {
    border: 'border-cyan-400/40',
    gradient: 'from-cyan-500/20 via-transparent to-transparent',
    text: 'text-cyan-200',
    glow: 'rgba(34,197,235,0.45)',
    line: 'from-transparent via-cyan-300/60 to-transparent',
    lineShadow: '0 0 14px rgba(34,197,235,0.55)',
  },
  gold: {
    border: 'border-amber-400/40',
    gradient: 'from-amber-500/20 via-transparent to-transparent',
    text: 'text-amber-200',
    glow: 'rgba(251,191,36,0.4)',
    line: 'from-transparent via-amber-300/60 to-transparent',
    lineShadow: '0 0 14px rgba(251,191,36,0.55)',
  },
  purple: {
    border: 'border-purple-500/40',
    gradient: 'from-purple-600/20 via-transparent to-transparent',
    text: 'text-purple-200',
    glow: 'rgba(167,139,250,0.45)',
    line: 'from-transparent via-purple-400/60 to-transparent',
    lineShadow: '0 0 14px rgba(167,139,250,0.6)',
  },
};

export interface PortfolioCardPhotographyProps {
  icon?: ReactNode | null;
  title: string;
  subline?: string;
  description: string;
  color: AccentColor;
  delay?: number;
  ringImages?: readonly string[];
}

export function PortfolioCardPhotography({
  icon,
  title,
  subline,
  description,
  color,
  delay = 0,
  ringImages,
}: PortfolioCardPhotographyProps) {
  const tokens = colorTokens[color];
  const hasRing = Boolean(ringImages?.length);
  const ringImagesList = hasRing ? Array.from(ringImages!) : [];
  const titleSpacingClass = hasRing ? 'mb-4' : 'mb-8';
  const descriptionText = description?.trim() ?? '';
  const descriptionLines = descriptionText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40, rotateX: -8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6, scale: 1.01 }}
      className="h-full card-hover"
    >
      <div className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border ${tokens.border} bg-black/40 px-8 py-10 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-2xl portfolio-card-content`}>
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${tokens.gradient} opacity-80`} />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 blur-3xl"
          style={{ background: `radial-gradient(circle at 35% 25%, ${tokens.glow}, transparent 65%)` }}
          animate={{ opacity: [0.4, 0.75, 0.4], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="relative z-10 flex h-full flex-col">
          <div className="flex flex-col items-center text-center card-title-block">
            {icon && <div className={`mb-6 text-4xl ${tokens.text}`}>{icon}</div>}
            <motion.h3
              className="glow-text mb-5 text-white tracking-wide"
              style={{
                fontSize: 'clamp(2.5rem, 2.5vw, 2.5rem)',
                lineHeight: 1.05,
                marginTop: '1.5rem',
              }}
              initial={{ opacity: 0, filter: 'blur(8px)', y: 10 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.85, delay: delay + 0.2, ease: 'easeOut' }}
            >
              {title}
            </motion.h3>
            <motion.div
              className={`mt-6 mx-auto h-[2px] bg-gradient-to-r ${tokens.line}`}
              style={{ boxShadow: tokens.lineShadow }}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '240px', opacity: 1 }}
              transition={{ duration: 0.9, delay: delay + 0.35, ease: 'easeOut' }}
            />
          </div>

          {(subline || descriptionLines.length > 0) && (
            <div className="mt-8 mb-6 text-center card-body-block">
              {subline && (
                <h3 className="portfolio-card-subline text-white text-lg uppercase tracking-[0.22em] leading-relaxed">
                  {subline}
                </h3>
              )}
              {descriptionLines.length > 0 && (
                <div
                  className="portfolio-card-desc mt-3 text-white/90 text-sm leading-relaxed"
                  style={{ letterSpacing: '0.04em', textTransform: 'none' }}
                >
                  {descriptionLines.map((line, idx) => (
                    <p
                      key={`${title}-description-${idx}`}
                      className={idx > 0 ? 'mt-2' : undefined}
                    >
                      {line}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
          <motion.p
            className="mt-6 w-full text-center text-[0.65rem] uppercase tracking-[0.35em] text-white/70"
            initial={{ opacity: 0.35 }}
            animate={{ opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            « CLICK &amp; DRAG »
          </motion.p>

          <div className="mt-8 flex flex-1 items-center justify-center">
            {hasRing ? (
              <div
                className="relative w-full max-w-[380px]"
                style={{ aspectRatio: '4 / 5', marginBottom: '4rem' }}
              >
                <ThreeDImageRing
                  images={ringImagesList}
                  width={400}
                  perspective={2000}
                  imageDistance={800}
                  tileSize={420}
                  tileAspectRatio={4 / 5}
                  hoverOpacity={0.45}
                  containerClassName="h-full w-full flex items-center justify-center"
                />
              </div>
            ) : (
              <div className="flex h-[220px] w-full items-center justify-center rounded-2xl border border-dashed border-white/20 text-[0.65rem] uppercase tracking-[0.4em] text-white/40">
                Gallery in progress
              </div>
            )}
          </div>

          <div className="mt-4" />
        </div>
      </div>
    </motion.article>
  );
}

export default PortfolioCardPhotography;
