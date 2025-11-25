import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import GlowNav from '../components/ui/GlowNav';

export default function Impressum() {
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
            IMPRESSUM
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
            IMPRINT
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
                <h2 className="text-white text-lg tracking-[0.14em] uppercase" style={{ marginTop: '0.6rem' }}>
                  Louis Kuschnir
                </h2>
                <p className="text-white/80 leading-relaxed" style={{ lineHeight: 1.7 }}>
                  Herdegert 27<br />
                  74523 Schwäbisch Hall<br />
                  (moving soon)
                </p>
                <p className="text-white/80 leading-relaxed" style={{ lineHeight: 1.7 }}>
                  E-Mail:{' '}
                  <a
                    href="mailto:louiskuschnir@gmail.com"
                    className="text-white underline underline-offset-4"
                  >
                    louiskuschnir@gmail.com
                  </a>
                </p>
              </div>

              <div className="space-y-3">
                <h3
                  className="text-white text-sm tracking-[0.12em] uppercase"
                  style={{ marginTop: '0.4rem' }}
                >
                  Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
                </h3>
                <p className="text-white/80 leading-relaxed" style={{ lineHeight: 1.7 }}>Louis Kuschnir</p>
              </div>

              <div className="space-y-5 text-white/70 leading-relaxed">
                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2" style={{ marginTop: '0.4rem' }}>
                    Haftungsausschluss (Disclaimer)
                  </h4>
                  <p style={{ lineHeight: 1.7 }}>
                    Die Inhalte dieser Webseite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit,
                    Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.
                    Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten verantwortlich.
                    Nach §§ 8 bis 10 TMG bin ich jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
                    Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                    hinweisen.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2" style={{ marginTop: '0.4rem' }}>
                    Haftung für Links
                  </h4>
                  <p style={{ lineHeight: 1.7 }}>
                    Diese Webseite enthält Links zu externen Webseiten Dritter, auf deren Inhalte ich keinen Einfluss habe.
                    Deshalb kann ich für diese fremden Inhalte keine Gewähr übernehmen. Für die Inhalte der verlinkten
                    Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich. Zum Zeitpunkt der Verlinkung
                    wurden die externen Seiten auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zu diesem
                    Zeitpunkt nicht erkennbar.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2" style={{ marginTop: '0.4rem' }}>
                    Urheberrecht
                  </h4>
                  <p style={{ lineHeight: 1.7 }}>
                    Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Webseite unterliegen dem deutschen
                    Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der
                    Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                    Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2" style={{ marginTop: '0.4rem' }}>
                    Weitere rechtliche Hinweise
                  </h4>
                  <p style={{ lineHeight: 1.7 }}>
                    Für die Inhalte dieser Seite kann keine Gewähr für Vollständigkeit oder Aktualität übernommen werden.
                    Änderungen vorbehalten. Alle Angaben ohne Gewähr.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Hosting Provider</h4>
                  <p>
                    Diese Website wird über einen Server in Deutschland betrieben und gehostet durch:
                    <br />
                    <br />
                    <strong>Hostinger International Ltd.</strong>
                    <br />
                    61 Lordou Vironos Street
                    <br />
                    6023 Larnaca, Zypern
                    <br />
                    <br />
                    Die Serverinfrastruktur befindet sich in Deutschland. Hostinger übernimmt die technische Bereitstellung,
                    jedoch keine inhaltliche Verantwortung für diese Website.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">
                    Google Analytics Hinweise
                  </h4>
                  <p>
                    Diese Website kann Google Analytics, einen Webanalysedienst der Google Inc., nutzen. Google Analytics
                    verwendet Cookies, die eine Analyse der Benutzung der Website ermöglichen. Die durch Cookies erzeugten
                    Informationen über Ihre Nutzung dieser Website können in der Regel an Server von Google in den USA
                    übertragen und dort gespeichert werden. Weitere Informationen zur Deaktivierung und Verwaltung der
                    Datenerhebung finden Sie unter:{' '}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout/"
                      className="underline underline-offset-4 text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      https://tools.google.com/dlpage/gaoptout/
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">
                    Hinweise zur Online-Streitbeilegung
                  </h4>
                  <p>
                    Die EU-Kommission stellt eine Plattform zur Online-Beilegung von Streitigkeiten (OS-Plattform) bereit:{' '}
                    <a
                      href="http://ec.europa.eu/consumers/odr"
                      className="underline underline-offset-4 text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://ec.europa.eu/consumers/odr
                    </a>
                    . Verbraucher haben die Möglichkeit, diese Plattform für die Beilegung von Streitigkeiten zu nutzen.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Bildernachweise</h4>
                  <p>
                    Alle verwendeten Bilder, Grafiken und Medien sind urheberrechtlich geschützt. Eine Weiterverwendung ist nur
                    mit ausdrücklicher Genehmigung gestattet.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">
                    Alternative Streitbeilegung nach § 36 VSBG
                  </h4>
                  <p>
                    Ich bin weder verpflichtet noch bereit, an einem Streitbeilegungsverfahren vor einer
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">
                    Verantwortlicher nach DSGVO
                  </h4>
                  <p>
                    Verantwortlich für die Datenverarbeitung gemäß Art. 4 Nr. 7 DSGVO:<br />
                    <strong>Louis Kuschnir</strong>
                  </p>
                </div>
              </div>
            </motion.div>
            ) : (
              <motion.div
                key="en"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="space-y-6 text-left"
              >
              <div className="space-y-2">
                <h2 className="text-white text-lg tracking-[0.14em] uppercase">Louis Kuschnir</h2>
                <p className="text-white/80 leading-relaxed">
                  Herdegert 27<br />
                  74523 Schwäbisch Hall<br />
                  (moving soon)
                </p>
                <p className="text-white/80 leading-relaxed">
                  Email:{' '}
                  <a
                    href="mailto:louiskuschnir@gmail.com"
                    className="text-white underline underline-offset-4"
                  >
                    louiskuschnir@gmail.com
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-white text-sm tracking-[0.12em] uppercase">
                  Responsible for content according to § 55 Abs. 2 RStV
                </h3>
                <p className="text-white/80 leading-relaxed">Louis Kuschnir</p>
              </div>

              <div className="space-y-4 text-white/70 leading-relaxed">
                <p className="text-xs uppercase tracking-[0.14em] text-white/60">
                  Note: The German version of this page is legally binding. The English text is a non-binding translation for
                  convenience.
                </p>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Disclaimer</h4>
                  <p>
                    The contents of this website have been created with the greatest care. However, I cannot guarantee the
                    accuracy, completeness, or timeliness of the content. As a service provider, I am responsible for my own
                    content on these pages in accordance with § 7 para. 1 TMG. According to §§ 8 to 10 TMG, I am not obligated to
                    monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal
                    activity.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Liability for Links</h4>
                  <p>
                    This website contains links to external third-party websites, over whose content I have no influence.
                    Therefore, I cannot assume any liability for these external contents. The respective provider or operator of
                    the pages is always responsible for the content of the linked pages. At the time of linking, the linked pages
                    were checked for possible legal violations. Unlawful content was not recognizable at that time.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Copyright</h4>
                  <p>
                    The content and works created by the site operator on these pages are subject to German copyright law.
                    Reproduction, editing, distribution, and any kind of utilization outside the limits of copyright law require
                    the written consent of the respective author or creator. Downloads and copies of this site are permitted only
                    for private, non-commercial use.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Further Legal Information</h4>
                  <p>
                    No guarantee is given for the completeness or accuracy of the information on this site. All information is
                    subject to change and provided without guarantee.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Hosting Provider</h4>
                  <p>
                    This website is operated on a server located in Germany and hosted by:
                    <br />
                    <br />
                    <strong>Hostinger International Ltd.</strong>
                    <br />
                    61 Lordou Vironos Street
                    <br />
                    6023 Larnaca, Cyprus
                    <br />
                    <br />
                    The server infrastructure is located in Germany. Hostinger provides the technical hosting but is not
                    responsible for the content of this website.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Google Analytics Information</h4>
                  <p>
                    This website may use Google Analytics, a web analytics service provided by Google Inc. Google Analytics uses
                    cookies that enable an analysis of your use of the website. The information generated by the cookie about your
                    use of this website may be transmitted to and stored on Google servers in the USA. For more information on
                    deactivating and managing data collection, please visit:{' '}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout/"
                      className="underline underline-offset-4 text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      https://tools.google.com/dlpage/gaoptout/
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">
                    Online Dispute Resolution
                  </h4>
                  <p>
                    The European Commission provides a platform for online dispute resolution (ODR):{' '}
                    <a
                      href="http://ec.europa.eu/consumers/odr"
                      className="underline underline-offset-4 text-white"
                      target="_blank"
                      rel="noreferrer"
                    >
                      http://ec.europa.eu/consumers/odr
                    </a>
                    . Consumers have the option of using this platform to resolve disputes.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">Image Credits</h4>
                  <p>
                    All images, graphics, and media used on this website are protected by copyright. Any reuse is only permitted
                    with explicit permission.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">
                    Alternative Dispute Resolution (Section 36 VSBG)
                  </h4>
                  <p>
                    I am neither obligated nor willing to participate in a dispute resolution procedure before
                    a consumer arbitration board.
                  </p>
                </div>

                <div>
                  <h4 className="text-white text-sm tracking-[0.12em] uppercase mb-2">
                    Controller according to GDPR
                  </h4>
                  <p>
                    Controller responsible for data processing pursuant to Art. 4 No. 7 GDPR:<br />
                    <strong>Louis Kuschnir</strong>
                  </p>
                </div>
              </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
