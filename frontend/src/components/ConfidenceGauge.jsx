import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden:  { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] } },
};

const SCALE_ITEMS = [
  { range: '80–100%', label: 'High',   color: 'text-emerald-400', track: 'bg-emerald-400' },
  { range: '60–79%',  label: 'Medium', color: 'text-amber-400',   track: 'bg-amber-400'   },
  { range: '0–59%',   label: 'Low',    color: 'text-red-400',     track: 'bg-red-400'     },
];

const TRACK_COLOR = 'rgba(51, 65, 85, 0.5)';

function getGaugeColor(c) {
  if (c >= 80) return '#34d399';
  if (c >= 60) return '#fbbf24';
  return '#f87171';
}

const ConfidenceGauge = ({ confidence }) => {
  const gaugeColor = useMemo(() => getGaugeColor(confidence), [confidence]);

  const data = useMemo(() => [
    { name: 'Confidence', value: confidence },
    { name: 'Remaining',  value: 100 - confidence },
  ], [confidence]);

  const colors = useMemo(() => [gaugeColor, TRACK_COLOR], [gaugeColor]);

  const reliability = useMemo(() => {
    if (confidence >= 80) return {
      label: 'High',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/30',
      message: 'The model is highly confident in this prediction.',
    };
    if (confidence >= 60) return {
      label: 'Medium',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/30',
      message: 'The model shows moderate confidence.',
    };
    return {
      label: 'Low',
      color: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/30',
      message: 'Consider retrying with a clearer image.',
    };
  }, [confidence]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass rounded-3xl p-5 lg:p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-shrink-0">
        <div className="bg-gradient-to-br from-neonBlue/20 to-neonBlue/5 p-2 rounded-xl border border-neonBlue/20">
          <TrendingUp className="w-4 h-4 text-neonBlue" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-bold text-white leading-tight">Confidence Analysis</h2>
          <p className="text-xs text-slate-500 mt-0.5">Model certainty breakdown</p>
        </div>
      </div>

      {/*
        Gauge arc — fills full card width.
        cy="100%" + height=140 means the semicircle center sits at the bottom,
        showing only the arc with no dead space above.
        innerRadius/outerRadius are large to use the full width.
      */}
      <motion.div
        variants={itemVariants}
        className="flex-shrink-0"
        aria-label={`Confidence gauge: ${confidence}%`}
      >
        <ResponsiveContainer width="100%" height={140}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius="55%"
              outerRadius="75%"
              dataKey="value"
              strokeWidth={0}
              animationDuration={900}
              animationBegin={100}
            >
              {data.map((_, i) => <Cell key={i} fill={colors[i]} />)}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Score + badge — centred directly below the arc */}
      <motion.div variants={itemVariants} className="flex-shrink-0 text-center -mt-2 mb-4">
        <p
          className="text-5xl lg:text-6xl font-extrabold leading-none mb-2"
          style={{ color: gaugeColor }}
          aria-live="polite"
        >
          {confidence}<span className="text-3xl font-bold">%</span>
        </p>
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${reliability.bg} ${reliability.color}`}>
          {reliability.label} Confidence
        </span>
        <p className="text-xs text-slate-500 mt-2 max-w-[200px] mx-auto leading-relaxed">
          {reliability.message}
        </p>
      </motion.div>

      {/* Scale legend — pushed to bottom of card via flex-1 spacer + mt-auto */}
      <div className="flex-1" />
      <motion.div variants={itemVariants} className="glass rounded-2xl p-3.5 flex-shrink-0">
        <p className="text-xs text-slate-500 mb-2.5 font-medium uppercase tracking-wider">Confidence Scale</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {SCALE_ITEMS.map(({ range, label, color, track }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className={`w-full h-0.5 rounded-full ${track} opacity-70`} />
              <span className={`font-semibold ${color}`}>{range}</span>
              <span className="text-slate-500">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default React.memo(ConfidenceGauge);
