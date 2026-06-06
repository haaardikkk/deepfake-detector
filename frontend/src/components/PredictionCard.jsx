import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Brain, AlertTriangle } from 'lucide-react';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.07 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const barVariants = {
  hidden:  { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 } },
};

const PredictionCard = ({ prediction }) => {
  const isReal = useMemo(() => prediction?.prediction === 'REAL', [prediction?.prediction]);

  const barClass   = isReal ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-red-500';
  const badgeClass = isReal ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-400'  : 'bg-red-400/10 border-red-400/30 text-red-400';
  const iconColor  = isReal ? 'text-emerald-400' : 'text-red-400';
  const ringColor  = isReal ? 'bg-emerald-400/8' : 'bg-red-400/8';

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass rounded-3xl p-5 lg:p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 flex-shrink-0">
        <div className="bg-gradient-to-br from-neonPurple/20 to-neonPurple/5 p-2 rounded-xl border border-neonPurple/20">
          <Brain className="w-4 h-4 text-neonPurple" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-bold text-white leading-tight">Prediction Result</h2>
          <p className="text-xs text-slate-500 mt-0.5">EfficientNet-B0 analysis</p>
        </div>
      </div>

      {/* Verdict — large and dominant, fills flex-1 */}
      <motion.div
        variants={itemVariants}
        className={`flex-1 flex flex-col items-center justify-center rounded-2xl ${ringColor} mb-4 py-6`}
      >
        {isReal
          ? <CheckCircle className={`w-16 h-16 lg:w-20 lg:h-20 mb-3 ${iconColor}`} aria-label="Real" />
          : <XCircle    className={`w-16 h-16 lg:w-20 lg:h-20 mb-3 ${iconColor}`} aria-label="Fake" />
        }
        <div className={`inline-flex items-center px-4 py-1.5 rounded-full border text-sm font-bold mb-2 ${badgeClass}`}>
          {prediction?.prediction}
        </div>
        <p className="text-slate-400 text-sm text-center max-w-[200px] leading-snug">
          {isReal ? 'This image appears to be authentic' : 'This image appears to be AI-generated'}
        </p>
      </motion.div>

      {/* Confidence bar */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-4 mb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 font-medium">Confidence</span>
          <span className="text-base font-bold gradient-text" aria-live="polite">
            {prediction?.confidence}%
          </span>
        </div>
        <div
          className="w-full bg-slate-700/60 rounded-full h-1.5 overflow-hidden"
          role="progressbar"
          aria-valuenow={prediction?.confidence}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <motion.div
            variants={barVariants}
            style={{ transformOrigin: 'left', width: `${prediction?.confidence}%` }}
            className={`h-full rounded-full ${barClass}`}
          />
        </div>
      </motion.div>

      {/* Detection note */}
      <motion.div variants={itemVariants} className="glass rounded-2xl p-3.5 flex items-start gap-2.5 flex-shrink-0">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-xs text-slate-400 leading-relaxed">
          <span className="text-slate-300 font-medium">Note — </span>
          Analysis via{' '}
          <span className="text-neonBlue font-medium">EfficientNet-B0</span>{' '}
          on AuthentiFace v2. Use a clear frontal face image for best results.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(PredictionCard);
