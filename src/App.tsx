import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ElectroBorder from './components/ui/electro-border';
import { CookieBanner } from './components/ui/CookieBanner';
import { detectLowPerformance } from './utils/detectLowPerformance';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Mentoring from './pages/Mentoring';
import About from './pages/About';
import Contact from './pages/Contact';
import Datenschutz from './pages/Datenschutz';
import Film from './pages/Film';
import Photography from './pages/Photography';
import Audio from './pages/Audio';
import Marketing from './pages/Marketing';
import Impressum from './pages/Impressum';

const CosmicBackground = lazy(async () => ({
  default: (await import('./components/CosmicBackground')).CosmicBackground,
}));

const SmokeyCursorFullScreen = lazy(() => import('./components/lightswind/smokey-cursor-full'));


export default function App() {
  const lowPerf = typeof navigator !== 'undefined' ? detectLowPerformance() : false;

  return (
    <>
      <div className="relative z-0 min-h-screen overflow-x-hidden">
        {/* Cosmic animated background */}
        <Suspense fallback={null}>
          <CosmicBackground />
        </Suspense>
        
        {/* smokey cursor animation */}
        {!lowPerf && (
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
          </Routes>
        </main>
        <Footer />
        <CookieBanner />
      </div>
    </>
  );
}
