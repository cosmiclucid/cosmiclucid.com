import { motion } from 'motion/react';

export default function Coaching() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start px-8 pt-32 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative text-center mb-20 mt-10 md:mt-20 flex flex-col items-center"
      >
        <motion.div
          className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[260px] bg-gradient-radial from-[#F7B500]/25 via-[#A96A00]/25 to-transparent blur-[120px] opacity-70 pointer-events-none"
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
          COACHING
        </motion.h1>

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
                'linear-gradient(90deg, rgba(180,120,10,0.35) 0%, rgba(255,198,76,0.95) 50%, rgba(180,120,10,0.35) 100%)',
              boxShadow: '0 0 28px rgba(255, 198, 76, 0.9), 0 0 60px rgba(180, 120, 10, 0.65)',
              filter: 'drop-shadow(0 0 22px rgba(255, 198, 76, 0.85))',
              height: '100%',
              borderRadius: '999px',
              opacity: 1,
            }}
          />
          <div
            className="absolute inset-0 rounded-full blur-lg pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(180,120,10,0.2) 0%, rgba(255,198,76,0.35) 50%, rgba(180,120,10,0.2) 100%)',
            }}
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95, ease: 'easeOut' }}
          className="text-center text-white leading-relaxed tracking-[0.4em] uppercase"
          style={{ marginTop: '2rem', marginBottom: '2rem', fontSize: '1rem' }}
        >
          — COMING SOON —
        </motion.p>
      </motion.div>
    </section>
  );
}
