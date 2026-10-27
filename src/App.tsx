import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/ui/CookieBanner';
import { useFxPreference } from './hooks/useFxPreference';

const Home = lazy(() => import('./pages/Home'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Websites = lazy(() => import('./pages/Websites'));
const Production = lazy(() => import('./pages/Production'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Datenschutz = lazy(() => import('./pages/Datenschutz'));
const Film = lazy(() => import('./pages/Film'));
const Photography = lazy(() => import('./pages/Photography'));
const Audio = lazy(() => import('./pages/Audio'));
const Marketing = lazy(() => import('./pages/Marketing'));
const Impressum = lazy(() => import('./pages/Impressum'));
const YourContent = lazy(() => import('./pages/YourContent'));

const CosmicBackground = lazy(async () => ({
  default: (await import('./components/CosmicBackground')).CosmicBackground,
}));

const SmokeyCursorFullScreen = lazy(() => import('./components/lightswind/smokey-cursor-full'));

const SMOKE_BACKGROUND = { r: 0.02, g: 0.03, b: 0.08 };

export default function App() {
  const { preference, setPreference } = useFxPreference();
  const fxEnabled = preference === 'on';
  const location = useLocation();

  const pageMeta: Record<string, { title: string; description: string }> = {
    '/': {
      title: 'Louis Lucid | Audiovisual Production, Social Media & Web Design',
      description: 'Audiovisual production, social media management and website design & development by Louis Lucid. Film, photography, sound and digital experiences for your business.',
    },
    '/websites': {
      title: 'Website Design & Development | Louis Lucid',
      description: 'Custom website design & development for ambitious brands. Clear messaging, responsive design and fast pages built to turn visitors into enquiries.',
    },
    '/production': {
      title: 'Audio Visual Production | Film, Photography & Sound | Louis Lucid',
      description: 'Cinematic video production, brand photography and audio production by Louis Lucid. Explore film, photography and sound services from concept to delivery.',
    },
    '/portfolio/marketing': {
      title: 'Social Media Management & Content Strategy | Louis Lucid',
      description: 'Social media management, content strategy, production and performance reporting to help brands publish consistently and connect with the right audience.',
    },
    '/portfolio': {
      title: 'Video, Photography & Audio Portfolio | Louis Lucid',
      description: 'Explore selected film, photography and audio production work by Louis Lucid.',
    },
    '/portfolio/film': {
      title: 'Film & Video Production Portfolio | Louis Lucid',
      description: 'Explore brand films, cinematic video and visual storytelling projects by Louis Lucid.',
    },
    '/portfolio/photography': {
      title: 'Photography Portfolio | Louis Lucid',
      description: 'Explore brand, portrait, event and creative photography by Louis Lucid.',
    },
    '/portfolio/audio': {
      title: 'Audio Production Portfolio | Louis Lucid',
      description: 'Explore music, sound design and audio production work by Louis Lucid.',
    },
    '/about': {
      title: 'About Louis Lucid | Audiovisual Production, Social Media & Websites',
      description: 'Meet Louis Lucid and learn about his approach to audiovisual production, social media management and website design & development.',
    },
    '/contact': {
      title: 'Contact Louis Lucid | Start a Creative Project',
      description: 'Get in touch with Louis Lucid about audiovisual production, social media management or website design & development.',
    },
  };

  useEffect(() => {
    const meta = pageMeta[location.pathname] ?? pageMeta['/'];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  }, [location.pathname]);

  return (
    <>
      <div className="relative z-0 min-h-screen overflow-x-hidden">
        {/* Background: full = animated, lite = static */}
        {fxEnabled ? (
          <Suspense fallback={null}>
            <CosmicBackground />
          </Suspense>
        ) : (
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-[10]"
            style={{
              background:
                'radial-gradient(circle at 20% 20%, rgba(90,0,255,0.22), transparent 55%), radial-gradient(circle at 80% 30%, rgba(56,189,248,0.16), transparent 52%), radial-gradient(circle at 50% 85%, rgba(17,24,39,0.9), rgba(2,6,23,1))',
            }}
          />
        )}
        
        {/* smokey cursor animation */}
        {fxEnabled && (
          <Suspense fallback={null}>
            <SmokeyCursorFullScreen
              className="-z-[5]"
              simulationResolution={96}
              dyeResolution={768}
              captureResolution={512}
              densityDissipation={2.4}
              velocityDissipation={1.9}
              pressure={0.12}
              pressureIterations={18}
              curl={12}
              splatRadius={0.2}
              splatForce={4200}
              colorUpdateSpeed={2.6}
              enableShading
              backgroundColor={SMOKE_BACKGROUND}
              transparent
              autoColors
              intensity={0.6}
            />
          </Suspense>
        )}

        {/* Main content */}
        <Header
          fxPreference={preference}
          onFxPreferenceChange={setPreference}
        />
        <main>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/film" element={<Film />} />
              <Route path="/portfolio/photography" element={<Photography />} />
              <Route path="/portfolio/audio" element={<Audio />} />
              <Route path="/portfolio/marketing" element={<Marketing />} />
              <Route path="/websites" element={<Websites />} />
              <Route path="/branding" element={<Navigate to="/" replace />} />
              <Route path="/production" element={<Production />} />
              <Route path="/mentoring" element={<Navigate to="/websites" replace />} />
              <Route path="/coaching" element={<Navigate to="/websites" replace />} />
              <Route path="/academy" element={<Navigate to="/websites" replace />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/your-content" element={<YourContent />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
}
