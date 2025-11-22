import { motion } from 'motion/react';

interface CategoryMediaPlaceholderProps {
  badge?: string;
  title: string;
  description: string;
  hint?: string;
}

export function CategoryMediaPlaceholder({
  badge,
  title,
  description,
  hint,
}: CategoryMediaPlaceholderProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 transition-all duration-500 hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent opacity-60 pointer-events-none" />

      <div className="relative z-10 flex h-full flex-col gap-4 text-white/80">
        {badge && (
          <span className="w-fit rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
            {badge}
          </span>
        )}

        <h3 className="text-2xl font-semibold tracking-tight text-white">
          {title}
        </h3>

        <p className="text-sm leading-relaxed text-white/70">{description}</p>

        {hint && (
          <p className="mt-auto text-xs uppercase tracking-[0.3em] text-white/40">
            {hint}
          </p>
        )}
      </div>
    </motion.div>
  );
}
