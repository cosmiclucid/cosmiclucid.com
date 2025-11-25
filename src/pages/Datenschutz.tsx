import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import GlowNav from '../components/ui/GlowNav';

export default function Datenschutz() {
  const [lang, setLang] = useState<'de' | 'en'>('de');
  const langItems = [
    { id: 'de', label: 'DE' },
    { id: 'en', label: 'EN' },
  ];
  const activeLangIndex = langItems.findIndex((l) => l.id === lang);

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none fixed inset-0 bg-gradient-radial from-[#51158C]/18 via-[#0B1024]/70 to-black blur-3xl opacity-70" />
      <div className="pointer-events-none fixed top-1/4 left-1/4 h-[520px] w-[520px] rounded-full bg-purple-600/10 blur-[150px]" />
      <div className="pointer-events-none fixed bottom-1/4 right-1/4 h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[150px]" />

      <div className="relative z-10 flex min-h-screen flex-col items-center px-6" style={{ paddingTop: '9rem', paddingBottom: '6rem' }}>
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative mb-12 mt-10 flex flex-col items-center text-center md:mt-20"
        >
          <motion.div
            className="pointer-events-none absolute -z-10 top-1/2 left-1/2 h-[260px] w-[720px] -translate-x-1/2 -translate-y-1/2 bg-gradient-radial from-[#51158C]/25 via-[#182E6F]/30 to-transparent blur-[120px] opacity-70"
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
            DATENSCHUTZ
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '420px', opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.7, ease: 'easeOut' }}
            className="mx-auto h-[2px] w-full max-w-[460px] rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.08) 100%)',
              boxShadow: '0 0 14px rgba(255, 255, 255, 0.55)',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-8 text-white text-center leading-relaxed"
            style={{
              marginBottom: '2rem',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              fontSize: '1.2rem',
              color: '#ffffff',
            }}
          >
            PRIVACY POLICY
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.1 }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <h3 className="text-white uppercase tracking-[0.18em]" style={{ fontSize: '0.95rem', letterSpacing: '0.24em' }}>
              Choose your language
            </h3>
            <div className="w-full max-w-[320px]">
              <GlowNav
                items={langItems}
                activeIndex={activeLangIndex < 0 ? 0 : activeLangIndex}
                onSelect={(index, item) => setLang((item.id as 'de' | 'en') ?? 'en')}
              />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl heavy-blur shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          style={{ padding: '2.75rem 2.5rem', color: 'rgba(255,255,255,0.85)' }}
        >
          <AnimatePresence mode="wait">
            {lang === 'de' ? (
              <motion.div
                key="de"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-8 text-left"
              >
                <div className="space-y-3">
                  <h2 className="text-white text-lg tracking-[0.14em] uppercase">Datenschutzerklärung</h2>
                  <h4 className="text-white/70 text-xs tracking-[0.12em] uppercase mb-1">
                    Hinweis: Die deutsche Version ist rechtlich bindend.
                  </h4>
                  <p className="text-white/80 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Diese Datenschutzerklärung informiert Sie über die Verarbeitung personenbezogener Daten auf dieser Website gemäß DSGVO.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Verantwortlicher</h3>
                  <p className="text-white/80 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Louis Kuschnir<br />
                    Herdegert 27<br />
                    74523 Schwäbisch Hall<br />
                    (moving soon)<br />
                    E-Mail: <a href="mailto:louiskuschnir@gmail.com" className="underline underline-offset-4 text-white">louiskuschnir@gmail.com</a><br />
                    Verantwortlich für die Datenverarbeitung gemäß Art. 4 Nr. 7 DSGVO: Louis Kuschnir.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Hosting</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Diese Website wird bei Hostinger auf einem Server in Deutschland gehostet. Anbieter: Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Zypern.
                    Hostinger stellt die technische Infrastruktur bereit, ist jedoch nicht inhaltlich verantwortlich.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Server-Logfiles</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Beim Aufruf der Website werden u. a. IP-Adresse, Datum/Uhrzeit, Referrer, Browser, Betriebssystem in Logfiles gespeichert, um Sicherheit und technischen Betrieb zu gewährleisten.
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Kontaktaufnahme</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Wenn Sie per E-Mail Kontakt aufnehmen, verarbeite ich Ihre Angaben zur Bearbeitung der Anfrage.
                    Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertrag/Anbahnung) und lit. f DSGVO (berechtigtes Interesse).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Eingebettete Inhalte (YouTube, ggf. weitere Plattformen)</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Eingebettete YouTube-Videos können Daten (z. B. IP-Adresse, Cookies) an Google/YouTube übermitteln.
                    Rechtsgrundlage: berechtigtes Interesse nach Art. 6 Abs. 1 lit. f DSGVO; falls ein Consent-Tool genutzt wird, können Videos nach Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) geladen werden.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Cookies und Einwilligung</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Technisch notwendige Cookies können eingesetzt werden (Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO). Nicht notwendige Cookies werden nur nach Einwilligung gesetzt (Art. 6 Abs. 1 lit. a DSGVO), z. B. über ein Consent-Banner, falls eingesetzt.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Google Analytics</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Es kann Google Analytics eingesetzt werden, um die Nutzung der Website auszuwerten. Dabei können Cookies genutzt und IP-Adressen anonymisiert werden.
                    Rechtsgrundlage: Einwilligung gem. Art. 6 Abs. 1 lit. a DSGVO (sofern per Consent-Tool eingeholt). Opt-out: <a href="https://tools.google.com/dlpage/gaoptout/" className="underline underline-offset-4 text-white">https://tools.google.com/dlpage/gaoptout/</a>
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Ihre Rechte</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Sie haben Rechte auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO), Einschränkung der Verarbeitung (Art. 18 DSGVO),
                    Datenübertragbarkeit (Art. 20 DSGVO), Widerspruch (Art. 21 DSGVO) sowie Beschwerde bei einer Aufsichtsbehörde.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Widerspruchsrecht</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Sie können der Verarbeitung Ihrer Daten aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Speicherdauer</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Personenbezogene Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen bestehen.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Datensicherheit</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Es werden technische und organisatorische Maßnahmen getroffen, um personenbezogene Daten vor Verlust, Missbrauch oder unbefugtem Zugriff zu schützen.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>
                    Alternative Streitbeilegung nach § 36 VSBG
                  </h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Ich bin weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Änderungen dieser Datenschutzerklärung</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Ich behalte mir vor, diese Datenschutzerklärung anzupassen. Es gilt stets die aktuelle Version auf dieser Website.
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="en"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-8 text-left"
              >
                <div className="space-y-3">
                  <h2 className="text-white text-lg tracking-[0.14em] uppercase">Privacy Policy</h2>
                  <h4 className="text-white/70 text-xs tracking-[0.12em] uppercase mb-1">
                    Note: The German version of this page is legally binding. The English version is a non-binding translation for convenience.
                  </h4>
                  <p className="text-white/80 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    This privacy policy explains how personal data is processed on this website in accordance with the GDPR.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Controller</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Responsible according to Art. 4(7) GDPR: Louis Kuschnir<br />
                    Herdegert 27<br />
                    74523 Schwäbisch Hall<br />
                    (moving soon)<br />
                    Email: <a href="mailto:louiskuschnir@gmail.com" className="underline underline-offset-4 text-white">louiskuschnir@gmail.com</a>
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Hosting</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    This site is hosted by Hostinger on a server located in Germany. Provider: Hostinger International Ltd., 61 Lordou Vironos Street, 6023 Larnaca, Cyprus.
                    Hostinger provides the technical infrastructure but is not responsible for content.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Server Log Files</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    When you visit this site, IP address, date/time, referrer, browser, operating system, etc. may be logged for security and technical operation.
                    Legal basis: Art. 6(1)(f) GDPR (legitimate interests).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Contact</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    If you contact me by email, the data you provide will be processed to handle your request.
                    Legal basis: Art. 6(1)(b) GDPR (contract/pre-contractual) and Art. 6(1)(f) GDPR (legitimate interests).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Embedded Content (YouTube, etc.)</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Embedded YouTube videos may transfer data (e.g., IP address, cookies) to Google/YouTube.
                    Legal basis: legitimate interest under Art. 6(1)(f) GDPR; where a consent tool is used, videos may be loaded after consent (Art. 6(1)(a) GDPR).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Cookies and Consent</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Technically necessary cookies may be used (legal basis: Art. 6(1)(f) GDPR). Optional cookies are set only with consent (Art. 6(1)(a) GDPR), e.g., via a consent banner if implemented.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Google Analytics</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Google Analytics may be used to analyze site usage. Cookies and IP anonymization may be employed.
                    Legal basis: consent under Art. 6(1)(a) GDPR (if obtained via consent tool). Opt-out: <a href="https://tools.google.com/dlpage/gaoptout/" className="underline underline-offset-4 text-white">https://tools.google.com/dlpage/gaoptout/</a>
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Your Rights</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    You have the right of access, rectification, erasure, restriction of processing, data portability, objection, and the right to lodge a complaint with a supervisory authority.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Right to Object</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    You may object to the processing of your data for reasons arising from your particular situation at any time (Art. 21 GDPR).
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Storage Period</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Personal data is stored only as long as necessary for the stated purposes or as required by legal retention periods.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>Data Security</h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    Technical and organizational measures are in place to protect personal data from loss, misuse, or unauthorized access.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>
                    Alternative Dispute Resolution (VSBG)
                  </h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    I am neither obliged nor willing to participate in dispute resolution proceedings before a consumer arbitration board.
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="text-white text-sm tracking-[0.12em] uppercase" style={{ marginTop: '0.4rem' }}>
                    Changes to this Privacy Policy
                  </h3>
                  <p className="text-white/70 leading-relaxed" style={{ lineHeight: 1.7 }}>
                    I reserve the right to update this privacy policy. The current version is available on this website.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
