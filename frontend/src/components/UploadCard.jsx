import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image as ImageIcon, X, Loader2, CheckCircle2, Clipboard } from 'lucide-react';
import { predictImage } from '../api';

const fadeVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } },
};

const errorVariants = {
  hidden:  { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: 'easeOut' } },
  exit:    { opacity: 0, transition: { duration: 0.12 } },
};

const VALID_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE_MB = 10;

function validateFile(file) {
  if (!VALID_TYPES.includes(file.type)) {
    throw new Error('Please upload a valid image file (JPG, JPEG, or PNG)');
  }
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`File size must be less than ${MAX_SIZE_MB}MB`);
  }
}

const UploadCard = ({
  onImageSelect,
  imagePreview,
  selectedImage,
  onPredictionResult,
  isLoading,
  setIsLoading,
  onReset,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error,      setError]      = useState(null);
  const fileInputRef = useRef(null);

  const handleFile = useCallback((file) => {
    setError(null);
    try { validateFile(file); } catch (err) { setError(err.message); return; }
    const reader = new FileReader();
    reader.onloadend = () => onImageSelect(file, reader.result);
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  useEffect(() => {
    const onPaste = (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of items) {
        if (item.type.startsWith('image/')) { const f = item.getAsFile(); if (f) handleFile(f); break; }
      }
    };
    window.addEventListener('paste', onPaste);
    return () => window.removeEventListener('paste', onPaste);
  }, [handleFile]);

  const handleDrag   = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); }, []);
  const handleDrop   = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }, [handleFile]);
  const handleChange = useCallback((e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }, [handleFile]);
  const handleClick  = useCallback(() => fileInputRef.current?.click(), []);
  const handleRemove = useCallback(() => { onReset(); setError(null); if (fileInputRef.current) fileInputRef.current.value = ''; }, [onReset]);

  const handleAnalyze = useCallback(async () => {
    if (!selectedImage || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await predictImage(selectedImage);
      onPredictionResult(result);
    } catch (err) {
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedImage, isLoading, setIsLoading, onPredictionResult]);

  return (
    <motion.div
      id="upload"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      /* h-full makes this card stretch to match its row partner's height */
      className="glass rounded-3xl p-5 lg:p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 flex-shrink-0">
        <div className="bg-gradient-to-br from-neonBlue/20 to-neonBlue/5 p-2 rounded-xl border border-neonBlue/20">
          <Upload className="w-4 h-4 text-neonBlue" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-base lg:text-lg font-bold text-white leading-tight">Upload Image</h2>
          <p className="text-xs text-slate-500 mt-0.5">JPG, JPEG, PNG — up to 10MB</p>
        </div>
      </div>

      {/* Content — flex-1 fills remaining height */}
      <div className="flex-1 flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {!imagePreview ? (
            <motion.div
              key="dropzone"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleClick}
              role="button"
              tabIndex={0}
              aria-label="Upload image by clicking, dragging, or pasting"
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleClick()}
              className={`
                flex-1 flex flex-col items-center justify-center rounded-2xl min-h-[260px]
                border-2 border-dashed cursor-pointer transition-colors duration-200
                outline-none focus-visible:ring-2 focus-visible:ring-neonBlue/60
                ${dragActive
                  ? 'border-neonBlue bg-neonBlue/[0.05]'
                  : 'border-slate-700 hover:border-slate-500 hover:bg-white/[0.02]'}
              `}
            >
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png"
                onChange={handleChange} className="hidden" aria-hidden="true" />
              <div className={`mb-3 transition-transform duration-200 ${dragActive ? '-translate-y-1' : ''}`} aria-hidden="true">
                <div className={`p-4 rounded-2xl transition-colors duration-200 ${dragActive ? 'bg-neonBlue/10' : 'bg-white/[0.04]'}`}>
                  <ImageIcon className={`w-9 h-9 transition-colors duration-200 ${dragActive ? 'text-neonBlue' : 'text-slate-500'}`} />
                </div>
              </div>
              <p className="text-sm font-medium text-slate-300 mb-1">
                {dragActive ? 'Drop to upload' : 'Drag & drop your image'}
              </p>
              <p className="text-sm text-slate-500 mb-3">
                or <span className="text-neonBlue font-medium">click to browse</span>
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Clipboard className="w-3 h-3" aria-hidden="true" />
                <span>Paste from clipboard (Ctrl+V)</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              variants={fadeVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex-1 flex flex-col gap-3"
            >
              {/* Image preview — flex-1 expands to fill available height */}
              <div className="relative group rounded-2xl overflow-hidden flex-1 min-h-[200px]">
                <img
                  src={imagePreview}
                  alt="Uploaded image preview"
                  className="w-full h-full object-cover absolute inset-0"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-200" />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  onClick={handleRemove}
                  aria-label="Remove selected image"
                  className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-500
                             backdrop-blur-sm p-2 rounded-xl opacity-0 group-hover:opacity-100
                             transition-opacity duration-200 shadow-lg"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </motion.button>
              </div>

              {/* File info row */}
              <div className="flex items-center gap-3 glass rounded-xl px-3 py-2.5 flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white truncate">{selectedImage?.name}</p>
                  <p className="text-xs text-slate-500">
                    {selectedImage ? (selectedImage.size / 1024).toFixed(1) : '0'} KB
                  </p>
                </div>
              </div>

              {/* Analyze button */}
              <motion.button
                whileHover={!isLoading ? { scale: 1.01 } : undefined}
                whileTap={!isLoading  ? { scale: 0.99 } : undefined}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={handleAnalyze}
                disabled={isLoading}
                aria-busy={isLoading}
                className="w-full py-3 rounded-2xl font-semibold text-sm transition-all btn-primary
                           text-white disabled:opacity-60 flex-shrink-0"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>Analyzing...</span>
                  </span>
                ) : 'Analyze Image'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            key="error"
            variants={errorVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="alert"
            className="mt-3 p-3 bg-red-500/10 border border-red-500/40 rounded-xl text-red-400 text-xs flex-shrink-0"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(UploadCard);
