import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, ChevronDown, Menu } from 'lucide-react';
import './Header.css';
import type { FxPreference } from '../hooks/useFxPreference';

type HeaderProps = {
  fxPreference: FxPreference;
  onFxPreferenceChange: (preference: FxPreference) => void;
};

const FX_OPTIONS: Array<{ value: FxPreference; label: string }> = [
  { value: 'on', label: 'FX On' },
  { value: 'off', label: 'FX Off' },
];

export function Header({
  fxPreference,
  onFxPreferenceChange,
}: HeaderProps) {
  const [fade, setFade] = useState(0); // 0..1
  const closeMenus = () => {
    document.querySelectorAll('.site-header details[open]').forEach((menu) => menu.removeAttribute('open'));
  };

  const serviceLinks = [
    { label: 'Audio Visual Production', href: '/production' },
    { label: 'Social Media Management', href: '/portfolio/marketing' },
    { label: 'Website Design & Development', href: '/websites' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY || 0;
      const progress = Math.min(1, Math.max(0, y / 180)); // fade in over first ~180px
      setFade(progress);
    };
    handleScroll(); // initialize on mount
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="site-header fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: `linear-gradient(to bottom, rgba(0,0,0,${(0.32 * fade).toFixed(3)}) 0%, rgba(0,0,0,${(0.22 * fade).toFixed(3)}) 60%, rgba(0,0,0,0) 100%)`,
        backdropFilter: `blur(${Math.round(8 * fade)}px)`,
        WebkitBackdropFilter: `blur(${Math.round(8 * fade)}px)`,
      }}
    >
      <div className="site-header__inner max-w-[1440px] mx-auto px-20 h-20 flex items-center justify-between">
        <Link to="/" className="site-logo" aria-label="Louis Lucid homepage" onClick={closeMenus}>
          <img src="/Favicon/LOUIS%20LUCID%20LOGO%20%28Brand%20Colors%29.png?v=11" alt="" className="site-logo-mark" width="48" height="48" />
        </Link>

        <nav className="primary-nav" aria-label="Main navigation" onKeyDown={(event) => {
          if (event.key === 'Escape') {
            const details = (event.target as HTMLElement).closest('details');
            details?.removeAttribute('open');
            details?.querySelector('summary')?.focus();
          }
        }}>
          <div className="desktop-links">
            <details className="services-menu">
              <summary>Services <ChevronDown size={14} aria-hidden="true" /></summary>
              <div className="services-panel">
                {serviceLinks.map(({ label, href }) => <Link key={label} to={href} onClick={closeMenus}>{label}</Link>)}
              </div>
            </details>
            <NavLink to="/portfolio" onClick={closeMenus}>Portfolio</NavLink>
            <NavLink to="/about" onClick={closeMenus}>About</NavLink>
            <NavLink to="/contact" onClick={closeMenus}>Contact</NavLink>
          </div>
          <Link className="header-book-call" to="/contact" onClick={closeMenus}>Book a Call</Link>
          <details className="mobile-menu">
            <summary aria-label="Open navigation"><Menu size={23} aria-hidden="true" /></summary>
            <div className="mobile-panel">
              <span className="mobile-services-label">Services</span>
              {serviceLinks.map(({ label, href }) => <Link key={label} to={href} onClick={closeMenus}>{label}</Link>)}
              <div className="mobile-main-links">
                <Link to="/portfolio" onClick={closeMenus}>Portfolio</Link>
                <Link to="/about" onClick={closeMenus}>About</Link>
                <Link to="/contact" onClick={closeMenus}>Contact</Link>
              </div>
            </div>
          </details>
        </nav>

        <div className="fx-control">
          <details className="fx-control__dropdown">
            <summary
              className="fx-control__menu"
              aria-label={`Visual effects: ${fxPreference}`}
              title="Visual effects"
            >
              <Sparkles aria-hidden="true" size={17} />
            </summary>
            <div className="fx-control__popover">
              <div className="fx-control__label">Visual effects</div>
              {FX_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="fx-control__option"
                  data-active={fxPreference === option.value}
                  onClick={(event) => {
                    onFxPreferenceChange(option.value);
                    event.currentTarget.closest('details')?.removeAttribute('open');
                  }}
                >
                  <span aria-hidden="true" className="fx-control__indicator" />
                  {option.label}
                </button>
              ))}
            </div>
          </details>
        </div>
      </div>
    </motion.header>
  );
}
