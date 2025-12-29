import { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/ui/CookieBanner';
import { detectLowPerformance } from './utils/detectLowPerformance';
import { getQualityMode, QualityMode, detectSafari } from './components/lib/qualityMode';

const Home = lazy(() => import('./pages/Home'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Mentoring = lazy(() => import('./pages/Mentoring'));
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


export default function App() {
  const [qualityMode, setQualityMode] = useState<QualityMode>(() => {
    return typeof window !== 'undefined' ? getQualityMode() : 'full';
  });
  const lowPerf = typeof navigator !== 'undefined' ? detectLowPerformance() : false;
  const safari = typeof navigator !== 'undefined' ? detectSafari() : false;
  const isLite = lowPerf || safari || qualityMode === 'lite';

  useEffect(() => {
    const next = getQualityMode();
    setQualityMode((prev) => (prev === next ? prev : next));
  }, []);

  return (
    <>
      <div className="relative z-0 min-h-screen overflow-x-hidden">
        {/* Background: full = animated, lite = static */}
        {!isLite ? (
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
        {!isLite && (
          <Suspense fallback={null}>
            <SmokeyCursorFullScreen
              className="-z-[5]"
              simulationResolution={320}
              dyeResolution={4096}
              captureResolution={1024}
              densityDissipation={2.4}
              velocityDissipation={1.9}
              pressure={0.12}
              pressureIterations={28}
              curl={12}
              splatRadius={0.2}
              splatForce={4200}
              colorUpdateSpeed={2.6}
              enableShading
              backgroundColor={{ r: 0.02, g: 0.03, b: 0.08 }}
              transparent
              autoColors
              intensity={0.6}
            />
          </Suspense>
        )}

        {/* Main content */}
        <Header />
        <main>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/film" element={<Film />} />
              <Route path="/portfolio/photography" element={<Photography />} />
              <Route path="/portfolio/audio" element={<Audio />} />
              <Route path="/portfolio/marketing" element={<Marketing />} />
              <Route path="/mentoring" element={<Mentoring />} />
              <Route path="/coaching" element={<Mentoring />} />
              <Route path="/academy" element={<Mentoring />} />
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
