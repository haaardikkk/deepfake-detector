import React, { useEffect, useRef } from 'react';

const CELL = 28;
const DOT  = 1.5;

const GridBackground = () => {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);
  const timeRef   = useRef(0);
  const stateRef  = useRef({ width: 0, height: 0, cols: 0, rows: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      const dpr    = Math.min(window.devicePixelRatio, 2);
      const width  = window.innerWidth;
      const height = document.documentElement.scrollHeight;

      // Reset transform before rescaling to prevent DPR accumulation on repeated resize.
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      stateRef.current = {
        width,
        height,
        cols: Math.ceil(width  / CELL) + 1,
        rows: Math.ceil(height / CELL) + 1,
        dpr,
      };
    };

    const draw = (timestamp) => {
      const t = timestamp * 0.0007;
      timeRef.current = t;

      const { width, height, cols, rows } = stateRef.current;
      ctx.clearRect(0, 0, width, height);

      const cx = width  * 0.5;
      const cy = height * 0.18;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x    = c * CELL;
          const y    = r * CELL;
          const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
          const wave = Math.sin(dist * 0.012 - t * 2.5) * 0.5 + 0.5;
          const alpha = wave * 0.28 + 0.03;

          ctx.beginPath();
          ctx.arc(x, y, DOT, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(99, 102, 241, ${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    rafRef.current = requestAnimationFrame(draw);

    const ro = new ResizeObserver(resize);
    ro.observe(document.documentElement);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      'fixed',
        inset:         0,
        zIndex:        0,
        pointerEvents: 'none',
      }}
    />
  );
};

export default React.memo(GridBackground);
