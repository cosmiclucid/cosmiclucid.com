import { Instagram, Youtube, Music, Mail } from 'lucide-react';
import { motion } from 'motion/react';

export function Footer() {
  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/cosmiclucid/?hl=de' },
    { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/channel/UCpNoUAF2n8qAbYAo9DaftKw' },
    { icon: Music, label: 'LinkMe', href: 'https://link.me/cosmiclucid' },
    { icon: Mail, label: 'Email', href: 'mailto:louiskuschnir@gmail.com' },
  ];

  const navLinks = ['Home', 'About', 'Contact', 'Impressum (Imprint)', 'Datenschutzerklärung (Privacy Policy)'];

  return (
    <footer className="relative pt-32 pb-12 overflow-hidden">
      {/* Light emanating from CTA into footer */}
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-40 z-20 bg-gradient-to-b from-[#8A2BE2]/45 via-[#51158C]/25 to-transparent"
      />

      {/* Concentrated top-center glow that diffuses downward */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 z-10 w-[min(100%,1200px)] h-48 
                   bg-[radial-gradient(ellipse_at_top,rgba(129,51,255,0.50),rgba(129,51,255,0.25)_40%,transparent_70%)]"
      />
      
      {/* Faint stars texture */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'radial-gradient(2px 2px at 20% 30%, white, transparent), radial-gradient(2px 2px at 60% 70%, white, transparent), radial-gradient(1px 1px at 50% 50%, white, transparent)',
        backgroundSize: '200px 200px, 300px 300px, 150px 150px',
      }} />

      <div className="relative z-10 max-w-[1440px] mx-auto px-8 text-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h3 className="text-white tracking-widest uppercase mb-3 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
            COSMICLUCID
          </h3>
          <p className="text-white/60 tracking-wider">
            Art | Film | Music | Mentoring
          </p>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-6 mb-12"
        >
          {socialLinks.map((social) => {
            const Icon = social.icon;
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center text-white/70 hover:text-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </motion.div>

        {/* Navigation Links */}
        <motion.nav
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          {navLinks.map((link) => (
            <a
              key={link}
              href={
                link.startsWith('Impressum')
                  ? '/impressum'
                  : link.startsWith('Datenschutzerklärung')
                  ? '/datenschutz'
                  : `/${link.toLowerCase().split(' ')[0]}`
              }
              className="text-white/60 hover:text-white transition-colors duration-300 tracking-wide"
            >
              {link}
            </a>
          ))}
        </motion.nav>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-white/40 text-sm tracking-wide"
        >
          © 2025 CosmicLucid | All Rights Reserved
        </motion.div>
      </div>
    </footer>
  );
}
