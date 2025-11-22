import { motion } from 'motion/react';
import { CategoryMediaPlaceholder } from '../components/CategoryMediaPlaceholder';

const marketingSections = [
  {
    id: 'campaigns',
    heading: 'Flagship Campaigns',
    copy:
      'Showcase case studies, launch campaigns, or creative direction projects. Replace placeholders with videos, decks, or interactive embeds that cover objectives, strategy, and results.',
    items: [
      {
        badge: 'Launch',
        title: 'Campaign Story',
        description:
          'Swap with a highlight reel, interactive deck, or storyline that summarizes goals and outcomes.',
        hint: 'Embed slides, Loom videos, or a custom component.',
      },
      {
        badge: 'Results',
        title: 'Data & Impact',
        description:
          'Feature charts, KPIs, or visual analytics that prove the transformation you delivered.',
        hint: 'Drop in charts, infographics, or hero quotes.',
      },
    ],
  },
  {
    id: 'social',
    heading: 'Content Systems',
    copy:
      'Present the social mechanics behind your campaigns. Replace with carousels, content calendars, or TikTok/IG Reels embeds.',
    items: [
      {
        badge: 'Content Series',
        title: 'Social Carousel',
        description:
          'Show a swipeable carousel or short-form series that supported the campaign.',
        hint: 'Use a horizontal slider or grid of reels here.',
      },
      {
        badge: 'Playbooks',
        title: 'Strategy Toolkit',
        description:
          'Highlight frameworks, scripts, or automations that underpin your marketing practice.',
        hint: 'Drop in Notion, FigJam, or PDF embeds.',
      },
    ],
  },
  {
    id: 'cta',
    heading: 'Partner With CosmicLucid',
    copy:
      'Guide collaborators toward your brand strategy services. Replace with a CTA tailored to your inbound flow.',
    items: [
      {
        badge: 'Connect',
        title: 'Marketing CTA / Discovery',
        description:
          'Swap for an intake form, calendar booking, or custom CTA panel.',
        hint: 'Encourage prospects to book a strategy session.',
      },
    ],
  },
];

export default function Marketing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#280818]/70 to-black" />
        <div className="absolute -top-28 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-pink-500/30 blur-[210px]" />
        <div className="absolute bottom-[-160px] right-[-120px] h-[520px] w-[520px] rounded-full bg-purple-500/35 blur-[230px]" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1280px] flex-col gap-24 px-8 pb-32 pt-40 md:px-12 lg:px-20">
        <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.02] px-6 py-16 text-center backdrop-blur-3xl md:px-12 lg:px-20">
          <motion.div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-pink-400/25 blur-[150px]"
            animate={{ opacity: [0.55, 0.85, 0.55], scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative mx-auto flex max-w-3xl flex-col items-center gap-8"
          >
            <span className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-1 text-[0.65rem] uppercase tracking-[0.45em] text-white/60">
              Marketing Portfolio
            </span>

            <motion.h1
              initial={{ opacity: 0, filter: 'blur(18px)', y: 30 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 1.1, delay: 0.1, ease: 'easeOut' }}
              className="text-white glow-text text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.75rem]"
              style={{ letterSpacing: '-0.015em', lineHeight: 1.05 }}
            >
              Exhibit the strategy, storytelling, and systems behind your
              marketing universes.
            </motion.h1>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '420px', opacity: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="mx-auto h-[3px] w-full max-w-[420px] rounded-full"
              style={{
                background:
                  'linear-gradient(90deg, rgba(79,11,53,0.2) 0%, rgba(236,72,153,0.95) 50%, rgba(79,11,53,0.2) 100%)',
                boxShadow: '0 0 24px rgba(236, 72, 153, 0.85)',
              }}
            />

            <p className="max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Replace each placeholder with the assets that best reveal your
              marketing firepower — decks, motion graphics, social content, and
              interactive embeds are all welcome.
            </p>
          </motion.div>
        </section>

        {marketingSections.map((section, sectionIndex) => (
          <section key={section.id} className="space-y-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              className="max-w-3xl space-y-4"
            >
              <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                {section.heading}
              </h2>
              <p className="text-white/65">{section.copy}</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {section.items.map((item) => (
                <CategoryMediaPlaceholder key={item.title} {...item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
