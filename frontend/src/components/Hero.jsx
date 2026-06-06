import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const pillVariants = {
  hidden:  { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const FEATURE_PILLS = [
  { icon: Shield, text: '~95% Accuracy',      id: 'pill-accuracy' },
  { icon: Zap,    text: 'Real-time Detection', id: 'pill-realtime' },
];

const Hero = () => {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center py-14 sm:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
      aria-label="Hero"
    >
      {/* Ambient colour wash — pure CSS, zero JS cost */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)', transform: 'translateZ(0)' }}
        />
        <div
          className="absolute top-1/3 -right-48 w-[480px] h-[480px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', transform: 'translateZ(0)' }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto text-center w-full"
      >
        {/* Model badge */}
        <motion.div variants={pillVariants} className="inline-flex mb-8">
          <div className="inline-flex items-center gap-2.5 glass px-5 py-2.5 rounded-full border border-neonBlue/20 shadow-sm shadow-neonBlue/10">
            <span
              className="w-2 h-2 rounded-full bg-neonBlue flex-shrink-0"
              style={{ boxShadow: '0 0 6px 2px rgba(0,212,255,0.5)' }}
              aria-hidden="true"
            />
            <span className="text-xs sm:text-sm text-slate-300 font-medium tracking-wide">
              EfficientNet-B0 · AuthentiFace v2
            </span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-[1.05] tracking-tight"
        >
          <span className="gradient-text">DeepFake</span>
          <br />
          <span className="text-white">Detector</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed"
        >
          Detect AI-generated faces with{' '}
          <span className="text-neonBlue font-semibold">state-of-the-art accuracy</span>
          {' '}— results in under a second.
        </motion.p>

        {/* CTA */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.a
            href="#upload"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="inline-flex items-center gap-3 btn-primary text-white font-semibold px-8 py-4 rounded-2xl text-base sm:text-lg shadow-lg shadow-accent/25 no-select"
          >
            Try the Detector
          </motion.a>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 sm:gap-4"
          role="list"
          aria-label="Key features"
        >
          {FEATURE_PILLS.map(({ icon: Icon, text, id }) => (
            <FeaturePill key={id} id={id} Icon={Icon} text={text} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

const FeaturePill = React.memo(({ id, Icon, text }) => (
  <motion.div
    id={id}
    role="listitem"
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.96 }}
    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    className="glass px-5 py-2.5 rounded-full flex items-center gap-2.5 cursor-default no-select border border-white/[0.08]"
  >
    <Icon className="w-4 h-4 text-neonPurple flex-shrink-0" aria-hidden="true" />
    <span className="text-slate-300 text-sm font-medium">{text}</span>
  </motion.div>
));

FeaturePill.displayName = 'FeaturePill';

export default Hero;
