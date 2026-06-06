import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Github, Menu, X } from 'lucide-react';
import Logo from './Logo';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'About',    href: '#about' },
];

const Navbar = () => {
  const [isScrolled,    setIsScrolled]    = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const { scrollY } = useScroll();
  const observerRef = useRef(null);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setIsScrolled(latest > 24);
    if (latest > 24 && mobileOpen) setMobileOpen(false);
  });

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
    );

    sections.forEach((s) => observerRef.current.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  const handleNavClick = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass border-b border-white/[0.07] shadow-lg shadow-black/20'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="section-container">
          <div className="flex items-center justify-between h-16">

            <a href="#" aria-label="DeepFake Detector — Home" className="no-select">
              <Logo size="lg" showText />
            </a>

            <div className="hidden sm:flex items-center gap-1">
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  onClick={handleNavClick}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    activeSection === href.replace('#', '')
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {activeSection === href.replace('#', '') && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/[0.07] rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </a>
              ))}

              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-3 flex items-center gap-2 glass px-4 py-2 rounded-xl hover:bg-white/[0.08] transition-colors text-sm font-medium text-slate-300 hover:text-white"
              >
                <Github className="w-4 h-4" aria-hidden="true" />
                <span>GitHub</span>
              </motion.a>
            </div>

            <motion.button
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={() => setMobileOpen((v) => !v)}
              className="sm:hidden glass p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <motion.div
        initial={false}
        animate={mobileOpen
          ? { opacity: 1, y: 0, pointerEvents: 'auto' }
          : { opacity: 0, y: -8, pointerEvents: 'none' }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="sm:hidden fixed top-16 inset-x-0 z-40 glass border-b border-white/[0.07] px-6 py-4 space-y-1"
      >
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            onClick={handleNavClick}
            className={`block w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
              activeSection === href.replace('#', '')
                ? 'text-white bg-white/[0.07]'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {label}
          </a>
        ))}
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <Github className="w-4 h-4" aria-hidden="true" />
          GitHub
        </a>
      </motion.div>
    </>
  );
};

export default React.memo(Navbar);
