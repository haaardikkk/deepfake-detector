import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Heart, ExternalLink } from 'lucide-react';
import Logo from './Logo';

const QUICK_LINKS = [
  { label: 'Features',         href: '#features' },
  { label: 'About',            href: '#about' },
  { label: 'GitHub',           href: 'https://github.com/haaardikkk' },
];

const SOCIAL_LINKS = [
  { icon: Github,   href: 'https://github.com/haaardikkk', target="_blank",  label: 'GitHub' },
  { icon: Linkedin, href: 'https://linkedin.com/in/haaardikkk', target = "_blank",label: 'LinkedIn' },
];

const CURRENT_YEAR = new Date().getFullYear();

const footerVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Footer = () => (
  <footer id="about" className="border-t border-white/[0.07] mt-8" aria-label="Site footer">
    <motion.div
      variants={footerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      className="section-container py-14 lg:py-16"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mb-10">

        <div>
          <div className="mb-4">
            <Logo size="md" showText />
          </div>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
            AI-powered deepfake detection using EfficientNet-B0 trained on the AuthentiFace v2 dataset.
          </p>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Links</h3>
          <ul className="space-y-2.5" role="list">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="group flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors duration-200 text-sm"
                >
                  <span>{label}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity duration-200" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Connect</h3>
          <div className="flex gap-2.5 mb-5" role="list">
            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
              <SocialIcon key={label} icon={Icon} href={href} label={label} />
            ))}
          </div>
          <p className="text-slate-500 text-sm leading-relaxed">
            Open source · React + FastAPI
          </p>
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-slate-500 text-xs sm:text-sm">
          © {CURRENT_YEAR} DeepFake Detector. All rights reserved.
        </p>
        <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-current" aria-hidden="true" />
          <span>by Hardikk</span>
        </p>
      </div>
    </motion.div>
  </footer>
);

const SocialIcon = React.memo(({ icon: Icon, href, label }) => (
  <motion.a
    role="listitem"
    whileHover={{ scale: 1.08, y: -1 }}
    whileTap={{ scale: 0.93 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="glass p-2.5 rounded-xl hover:bg-white/[0.08] transition-colors duration-200"
  >
    <Icon className="w-4 h-4 text-slate-400" aria-hidden="true" />
  </motion.a>
));

SocialIcon.displayName = 'SocialIcon';

export default Footer;
