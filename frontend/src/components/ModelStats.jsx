import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Database, Layers, Maximize2, Award, Zap } from 'lucide-react';

const STATS = [
  { icon: Cpu,       label: 'Model Architecture', value: 'EfficientNet-B0', color: 'text-neonBlue',    border: 'border-neonBlue/20',    bg: 'bg-neonBlue/10'    },
  { icon: Database,  label: 'Training Dataset',   value: 'AuthentiFace v2', color: 'text-neonPurple', border: 'border-neonPurple/20',  bg: 'bg-neonPurple/10'  },
  { icon: Layers,    label: 'Output Classes',      value: 'Real / Fake',    color: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/10' },
  { icon: Maximize2, label: 'Input Size',          value: '224 × 224 px',   color: 'text-amber-400',  border: 'border-amber-400/20',   bg: 'bg-amber-400/10'   },
  { icon: Award,     label: 'Accuracy',            value: '~95%+',          color: 'text-pink-400',   border: 'border-pink-400/20',    bg: 'bg-pink-400/10'    },
  { icon: Zap,       label: 'Inference Time',      value: '< 1 second',     color: 'text-orange-400', border: 'border-orange-400/20',  bg: 'bg-orange-400/10'  },
];

const sectionVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const gridVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const ModelStats = () => (
  <section id="features" className="py-24" aria-labelledby="features-heading">
    <div className="section-container">
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="text-center mb-14 lg:mb-16"
      >
        <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full border border-white/[0.08] mb-5">
          <Cpu className="w-3.5 h-3.5 text-neonBlue" aria-hidden="true" />
          <span className="text-xs text-slate-400 font-medium tracking-wide">Under the Hood</span>
        </div>
        <h2
          id="features-heading"
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 gradient-text"
        >
          Model Information
        </h2>
        <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Powered by state-of-the-art deep learning technology for accurate deepfake detection
        </p>
      </motion.div>

      <motion.div
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
      >
        {STATS.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </motion.div>
    </div>
  </section>
);

const StatCard = React.memo(({ stat }) => {
  const Icon = stat.icon;
  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ scale: 1.025, y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      className="glass rounded-2xl p-5 lg:p-6 border border-white/[0.07] cursor-default"
    >
      <div className={`inline-flex p-3 rounded-xl border mb-4 ${stat.border} ${stat.bg}`}>
        <Icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
      </div>
      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1.5">{stat.label}</p>
      <p className="text-xl lg:text-2xl font-bold text-white">{stat.value}</p>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export default ModelStats;
