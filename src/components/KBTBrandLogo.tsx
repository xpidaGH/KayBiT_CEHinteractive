import React from 'react';

export type BrandLogoVariant = 'web-header' | 'desktop-titlebar' | 'mobile-appbar' | 'showcase';

interface KBTBrandLogoProps {
  variant?: BrandLogoVariant;
  size?: number;
  className?: string;
  showGlow?: boolean;
  onClick?: () => void;
}

/**
 * KBT App Logo Component
 * Implements the tech-styled green/yellow cyber spider brand asset
 * with multiplatform resizing for:
 * 1. Desktop Title Bars (Windows / macOS) [16x16 - 24x24]
 * 2. Mobile App Bars (iOS / Android) [28x28 - 32x32]
 * 3. Web Header Bars (Browsers / Web Apps) [34x34 - 40x40]
 * 4. High-Res Squircle Showcase (PWA / App Icon) [96x96 - 128x128]
 */
export const KBTBrandLogo: React.FC<KBTBrandLogoProps> = ({
  variant = 'web-header',
  size,
  className = '',
  showGlow = true,
  onClick
}) => {
  // Use cases styling per kbt-integration-guide.txt
  if (variant === 'desktop-titlebar') {
    const dim = size || 20;
    return (
      <div
        className={`inline-flex items-center justify-center rounded-sm bg-black border border-emerald-500/30 overflow-hidden ${className}`}
        style={{ width: `${dim}px`, height: `${dim}px` }}
        onClick={onClick}
        title="KBT Desktop Titlebar Icon (Windows / macOS)"
      >
        <img
          src="/assets/kbt-logo.png"
          alt="KBT Titlebar Icon"
          className="w-full h-full object-contain filter drop-shadow-[0_0_4px_rgba(74,222,128,0.4)]"
          onError={(e) => {
            // Graceful fallback to SVG if image not ready
            e.currentTarget.src = '/icon.svg';
          }}
        />
      </div>
    );
  }

  if (variant === 'mobile-appbar') {
    const dim = size || 30;
    return (
      <div
        className={`relative inline-flex items-center justify-center mask-squircle bg-gradient-to-br from-zinc-900 to-black border border-lime-400/30 ${className}`}
        style={{ width: `${dim}px`, height: `${dim}px` }}
        onClick={onClick}
        title="KBT Mobile App Bar Logo (iOS / Android)"
      >
        <img
          src="/assets/kbt-logo.png"
          alt="KBT Mobile Logo"
          className="w-full h-full object-contain p-1 filter drop-shadow-[0_0_6px_rgba(163,230,53,0.6)]"
          onError={(e) => {
            e.currentTarget.src = '/icon.svg';
          }}
        />
      </div>
    );
  }

  if (variant === 'showcase') {
    const dim = size || 96;
    return (
      <div
        className={`relative bg-gradient-to-br from-zinc-900 via-black to-zinc-950 p-3 mask-squircle flex items-center justify-center border border-yellow-400/25 shadow-2xl transition-transform hover:scale-105 ${className}`}
        style={{ width: `${dim}px`, height: `${dim}px` }}
        onClick={onClick}
        title="KBT App Icon - Authentic Squircle Geometry"
      >
        <img
          src="/assets/kbt-logo.png"
          alt="KBT Cyber Spider App Icon"
          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(163,230,53,0.7)]"
          onError={(e) => {
            e.currentTarget.src = '/icon.svg';
          }}
        />
      </div>
    );
  }

  // Default: web-header (Web Browsers / Web Apps)
  const dim = size || 34;
  return (
    <div
      className={`relative inline-flex items-center justify-center mask-squircle bg-gradient-to-br from-zinc-900 to-black border border-lime-400/30 p-1 transition-all ${
        showGlow ? 'shadow-[0_0_14px_rgba(74,222,128,0.25)]' : ''
      } ${className}`}
      style={{ width: `${dim}px`, height: `${dim}px` }}
      onClick={onClick}
      title="KayBiT CEH v13 Brand Logo"
    >
      <img
        src="/assets/kbt-logo.png"
        alt="KayBiT Brand Logo"
        className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]"
        onError={(e) => {
          e.currentTarget.src = '/icon.svg';
        }}
      />
    </div>
  );
};
