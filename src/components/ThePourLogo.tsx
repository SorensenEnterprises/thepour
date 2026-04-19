import React from 'react';

interface Props {
  glassSize?: number;
  fontSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function ThePourLogo({ glassSize = 28, fontSize = 20, className, style }: Props) {
  const glassWidth = Math.round(glassSize * 0.667);

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: Math.round(glassSize * 0.38),
        ...style,
      }}
    >
      <svg
        width={glassWidth}
        height={glassSize}
        viewBox="0 0 32 48"
        fill="none"
        stroke="#f5ead8"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
        aria-hidden="true"
      >
        {/* Rim */}
        <line x1="2" y1="4" x2="30" y2="4" />
        {/* Bowl */}
        <line x1="2" y1="4" x2="16" y2="30" />
        <line x1="30" y1="4" x2="16" y2="30" />
        {/* Liquid — detail line */}
        <line x1="8" y1="13" x2="24" y2="13" stroke="#f5ead8" strokeOpacity="0.35" strokeWidth="1.8" />
        {/* Olive pick — detail */}
        <line x1="16" y1="24" x2="24" y2="9" stroke="#f5ead8" strokeOpacity="0.35" strokeWidth="1.6" />
        <circle cx="24" cy="7.5" r="2" stroke="#f5ead8" strokeOpacity="0.35" strokeWidth="1.6" />
        {/* Stem */}
        <line x1="16" y1="30" x2="16" y2="41" />
        {/* Base */}
        <ellipse cx="16" cy="44.5" rx="11" ry="3.5" />
      </svg>

      <span
        style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize,
          letterSpacing: '-0.5px',
          color: '#f5ead8',
          lineHeight: 1,
        }}
      >
        thepour<span style={{ color: '#4abbc4' }}>.</span>
      </span>
    </span>
  );
}
