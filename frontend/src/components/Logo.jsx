import React from 'react';

const SIZES = {
  sm: { icon: 28, text: 'text-sm'   },
  md: { icon: 34, text: 'text-base' },
  lg: { icon: 48, text: 'text-xl'   },
};

const Logo = ({ size = 'md', showText = true, className = '' }) => {
  const { icon, text } = SIZES[size] ?? SIZES.md;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/logo.png"
        alt="DeepFake Detector logo"
        width={icon}
        height={icon}
        style={{ flexShrink: 0, objectFit: 'contain' }}
        draggable={false}
      />

      {showText && (
        <span className={`font-bold gradient-text tracking-tight ${text}`}>
          DeepFake Detector
        </span>
      )}
    </div>
  );
};

export default React.memo(Logo);
