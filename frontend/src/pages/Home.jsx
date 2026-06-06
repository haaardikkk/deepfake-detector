import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import UploadCard from '../components/UploadCard';
import PredictionCard from '../components/PredictionCard';
import ConfidenceGauge from '../components/ConfidenceGauge';
import HeatmapCard from '../components/HeatmapCard';
import ModelStats from '../components/ModelStats';
import Footer from '../components/Footer';
import GridBackground from '../components/GridBackground';

const EASE = [0.25, 0.46, 0.45, 0.94];

// Inline SVG icons for empty slots — no extra import needed
const SparkleIcon = () => (
  <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
  </svg>
);
const EyeIcon = () => (
  <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ChartIcon = () => (
  <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

// Empty slot — desktop-only placeholder while awaiting prediction
const EmptySlot = ({ Icon, label, sub, className = '' }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } }}
    exit={{ opacity: 0, transition: { duration: 0.15 } }}
    className={`hidden lg:flex flex-col items-center justify-center glass rounded-3xl
                border border-dashed border-white/[0.06] text-center px-6 py-8 ${className}`}
    aria-hidden="true"
  >
    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center mb-3">
      <Icon />
    </div>
    <p className="text-slate-600 text-sm font-medium">{label}</p>
    {sub && <p className="text-slate-700 text-xs mt-1">{sub}</p>}
  </motion.div>
);

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview,  setImagePreview]  = useState(null);
  const [prediction,    setPrediction]    = useState(null);
  const [isLoading,     setIsLoading]     = useState(false);

  const handleImageSelect = useCallback((file, preview) => {
    setSelectedImage(file);
    setImagePreview(preview);
    setPrediction(null);
  }, []);

  const handlePredictionResult = useCallback((result) => setPrediction(result), []);

  const handleReset = useCallback(() => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setIsLoading(false);
  }, []);

  const hasPrediction = useMemo(() => Boolean(prediction), [prediction]);

  return (
    <div className="min-h-screen bg-primary">
      <GridBackground />

      <div className="relative z-10">
        <Navbar />

        <main>
          <Hero />

          <section id="upload" className="py-10 lg:py-16" aria-label="Upload and analyze">
            <div className="section-container">

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="text-center mb-8 lg:mb-10"
              >
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white mb-2">
                  Detect a Deepfake
                </h2>
                <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
                  Upload any portrait — verdict and attention map in under a second.
                </p>
              </motion.div>

              {/*
                ╔══════════════════╦══════════════════╗
                ║  Upload Image    ║  Prediction      ║  ← Row 1 — equal height via items-stretch
                ╠══════════════════╬══════════════════╣
                ║  Attention Map   ║  Confidence      ║  ← Row 2 — equal height via items-stretch
                ╚══════════════════╩══════════════════╝
                Mobile: single column Upload → Prediction → Heatmap → Confidence
              */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">

                {/* ── Row 1, Col 1: Upload (always visible) ── */}
                <UploadCard
                  onImageSelect={handleImageSelect}
                  imagePreview={imagePreview}
                  selectedImage={selectedImage}
                  onPredictionResult={handlePredictionResult}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                  onReset={handleReset}
                />

                {/* ── Row 1, Col 2: Prediction Result ── */}
                <AnimatePresence mode="wait">
                  {hasPrediction ? (
                    <motion.div
                      key="pred"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      className="flex flex-col"
                    >
                      <PredictionCard prediction={prediction} />
                    </motion.div>
                  ) : (
                    <EmptySlot
                      key="pred-ph"
                      Icon={SparkleIcon}
                      label="Results will appear here"
                      sub="Upload an image and click Analyze"
                    />
                  )}
                </AnimatePresence>

                {/* ── Row 2, Col 1: Model Attention Map ── */}
                <AnimatePresence mode="wait">
                  {hasPrediction ? (
                    <motion.div
                      key="heat"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.05 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      className="flex flex-col"
                    >
                      <HeatmapCard
                        heatmap={prediction.heatmap}
                        originalPreview={imagePreview}
                      />
                    </motion.div>
                  ) : (
                    <EmptySlot
                      key="heat-ph"
                      Icon={EyeIcon}
                      label="Attention map will appear here"
                      sub="Highlights regions influencing the result"
                    />
                  )}
                </AnimatePresence>

                {/* ── Row 2, Col 2: Confidence Analysis ── */}
                <AnimatePresence mode="wait">
                  {hasPrediction ? (
                    <motion.div
                      key="conf"
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.1 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      className="flex flex-col"
                    >
                      <ConfidenceGauge confidence={prediction.confidence} />
                    </motion.div>
                  ) : (
                    <EmptySlot
                      key="conf-ph"
                      Icon={ChartIcon}
                      label="Confidence analysis will appear here"
                      sub="Model certainty breakdown"
                    />
                  )}
                </AnimatePresence>

              </div>
            </div>
          </section>

          <ModelStats />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
