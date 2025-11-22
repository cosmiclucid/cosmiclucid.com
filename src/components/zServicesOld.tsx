import { ServiceCard } from './zServiceCardOld';
import { Film, Smartphone, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export function Services() {
  return (
    <section id="services" className="relative z-10 -mt-6 md:-mt-10 pt-32 pb-40 px-8">
      <div className="max-w-[1440px] mx-auto">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-white mb-4 tracking-wide">
            Explore My Universe
          </h2>
          <p className="text-white/70 tracking-wide">
            From cinematic storytelling to energy-based transformation.
          </p>
          
          {/* Decorative line */}
          <div className="mt-6 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-[#51158C] to-transparent" />
        </motion.div>

        {/* Service Cards */}
        <div className="flex flex-wrap justify-center gap-10 items-stretch">
          <ServiceCard
            icon={<Film className="w-16 h-16 text-purple-400 filter drop-shadow-[0_0_16px_rgba(124,58,237,0.45)]" />}
            title="Audiovisual Production"
            description="From concept to cinematic delivery — film, editing, sound, and color."
            buttonText="View Portfolio"
            buttonHref="#portfolio"
            delay={0.1}
          />

          <ServiceCard
            icon={<Smartphone className="w-16 h-16 text-blue-400 filter drop-shadow-[0_0_16px_rgba(59,130,246,0.45)]" />}
            title="Social Media Marketing"
            description="Creative storytelling and growth strategies for brands that move people."
            delay={0.2}
          />

          <ServiceCard
            icon={<Sparkles className="w-16 h-16 text-amber-200 filter drop-shadow-[0_0_20px_rgba(255,215,0,0.5)]" />}
            title="LUCID BMS SYSTEM"
            description="Transform energy, clarity, and creativity through the Body–Mind–Soul Method."
            buttonText="Explore Coaching"
            buttonHref="#coaching"
            delay={0.3}
            accent="gold"
          />
        </div>
      </div>
    </section>
  );
}
