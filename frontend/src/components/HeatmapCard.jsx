import React from 'react';
import { motion } from 'framer-motion';
import { ScanEye, ImageOff } from 'lucide-react';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const HeatmapCard = ({ heatmap, originalPreview }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    className="glass rounded-3xl p-5 lg:p-6 flex flex-col h-full"
  >
    {/* Header */}
    <div className="flex items-center gap-3 mb-4 flex-shrink-0">
      <div className="bg-gradient-to-br from-orange-400/20 to-orange-400/5 p-2 rounded-xl border border-orange-400/20">
        <ScanEye className="w-4 h-4 text-orange-400" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-base lg:text-lg font-bold text-white leading-tight">Model Attention Map</h2>
        <p className="text-xs text-slate-500 mt-0.5">Visual explanation of regions influencing the prediction.</p>
      </div>
    </div>

    {/*
      Image panels — flex-1 stretches to fill available card height.
      Each panel is a relative container; the img is absolute inset-0
      so it fills 100% of the panel without setting a fixed aspect ratio.
    */}
    <motion.div variants={itemVariants} className="flex-1 grid grid-cols-2 gap-3 min-h-0 mb-3">

      <div className="flex flex-col min-h-0">
        <p className="text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-widest flex-shrink-0">Original</p>
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-white/[0.03] min-h-[120px]">
          <img
            src={originalPreview}
            alt="Original uploaded image"
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      <div className="flex flex-col min-h-0">
        <p className="text-xs text-slate-500 font-medium mb-1.5 uppercase tracking-widest flex-shrink-0">Attention</p>
        <div className="relative flex-1 rounded-2xl overflow-hidden bg-white/[0.03] min-h-[120px] flex items-center justify-center">
          {heatmap ? (
            <img
              src={`data:image/png;base64,${heatmap}`}
              alt="Grad-CAM heatmap"
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 p-4 text-center">
              <ImageOff className="w-6 h-6 text-slate-600" aria-hidden="true" />
              <p className="text-xs text-slate-600 leading-snug">Heatmap unavailable</p>
            </div>
          )}
        </div>
      </div>

    </motion.div>

    <motion.p variants={itemVariants} className="text-xs text-slate-600 text-center flex-shrink-0">
      {heatmap
        ? 'Warmer colours indicate regions with greater influence on the prediction.'
        : 'The attention map could not be generated for this image.'}
    </motion.p>
  </motion.div>
);

export default React.memo(HeatmapCard);
