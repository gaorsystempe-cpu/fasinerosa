import React from 'react';

interface BrandLogoProps {
  variant?: 'blue' | 'cream' | 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'blue',
  size = 'md',
  withTagline = true,
  className = '',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'cream':
        return { text: 'text-[#FFF3C1]', subtitle: 'text-[#FFF3C1]' };
      case 'white':
        return { text: 'text-white', subtitle: 'text-white/90' };
      case 'dark':
        return { text: 'text-[#2C2D2F]', subtitle: 'text-[#2C2D2F]' };
      case 'blue':
      default:
        return { text: 'text-[#00167A]', subtitle: 'text-[#00167A]' };
    }
  };

  const getSizes = () => {
    switch (size) {
      case 'sm':
        return { title: 'text-2xl leading-none', subtitle: 'text-[9px] tracking-[0.25em]' };
      case 'lg':
        return { title: 'text-5xl md:text-6xl leading-none', subtitle: 'text-sm md:text-base tracking-[0.3em]' };
      case 'xl':
        return { title: 'text-6xl md:text-7xl leading-none', subtitle: 'text-base md:text-lg tracking-[0.35em]' };
      case 'md':
      default:
        return { title: 'text-3xl md:text-4xl leading-none', subtitle: 'text-[11px] md:text-xs tracking-[0.28em]' };
    }
  };

  const { text, subtitle } = getColors();
  const { title: titleSize, subtitle: subtitleSize } = getSizes();

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <span className={`font-teko font-bold uppercase ${titleSize} ${text} tracking-wider transition-colors`}>
        LA FACINEROSA
      </span>
      {withTagline && (
        <span className={`font-gotham font-semibold uppercase ${subtitleSize} ${subtitle} mt-0.5 transition-colors`}>
          PICANTERÍA PIURANA
        </span>
      )}
    </div>
  );
};

export const BrandEmblem: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 40,
  color = '#00167A',
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="4" fill="none" />
      <path
        d="M26 48C34 40 42 40 50 48C58 56 66 56 74 48"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M26 60C34 52 42 52 50 60C58 68 66 68 74 60"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="50" cy="30" r="7" fill={color} />
    </svg>
  );
};
