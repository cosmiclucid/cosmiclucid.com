import { Routes, Route } from 'react-router-dom';
import { CosmicBackground } from './components/CosmicBackground';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import ElectroBorder from './components/ui/electro-border';
import SmokeyCursorFullScreen from './components/lightswind/smokey-cursor-full';
import { CookieBanner } from './components/ui/CookieBanner';

import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import Coaching from './pages/Coaching';
import Academy from './pages/Academy';
import About from './pages/About';
import Contact from './pages/Contact';
import Datenschutz from './pages/Datenschutz';
import Film from './pages/Film';
import Photography from './pages/Photography';
import Audio from './pages/Audio';
import Marketing from './pages/Marketing';
import Impressum from './pages/Impressum';



export default function App() {
  return (
    <>
      <div className="relative z-0 min-h-screen overflow-x-hidden">
        {/* Cosmic animated background */}
        <CosmicBackground />
        
        {/* smokey cursor animation */}
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
            <Route path="/coaching" element={<Coaching />} />
            <Route path="/academy" element={<Academy />} />
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
