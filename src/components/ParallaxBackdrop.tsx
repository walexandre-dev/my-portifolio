import React from 'react';
import { computeParallaxOffset } from '../utils/portfolioLogic';

interface ParallaxBackdropProps {
  scrollY: number;
  mouseNorm: { x: number; y: number };
  reducedMotion: boolean;
}

export const ParallaxBackdrop: React.FC<ParallaxBackdropProps> = ({
  scrollY,
  mouseNorm,
  reducedMotion,
}) => {
  // 3-Level Spatial Parallax System (Requirement 4)
  // Background layer moves slowly (-0.08x), Midground moves moderately (-0.18x + mouse offset)
  const bgOffsetY = reducedMotion ? 0 : computeParallaxOffset(scrollY, -0.06, 180);
  const midOffsetY = reducedMotion ? 0 : computeParallaxOffset(scrollY, -0.14, 240);
  const mouseShiftX = reducedMotion ? 0 : Number((mouseNorm.x * 18).toFixed(2));
  const mouseShiftY = reducedMotion ? 0 : Number((mouseNorm.y * 14).toFixed(2));

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {/* CAMADA DE FUNDO: Ambient Gradients & Low-Opacity Geometric Fields */}
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `translate3d(0px, ${bgOffsetY}px, 0px)`,
        }}
      >
        <div
          className="absolute -top-32 left-1/4 h-[520px] w-[520px] rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(6,182,212,0.28) 0%, rgba(7,9,14,0) 70%)',
          }}
        />
        <div
          className="absolute top-[45%] right-10 h-[460px] w-[460px] rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(37,99,235,0.26) 0%, rgba(7,9,14,0) 70%)',
          }}
        />
      </div>

      {/* CAMADA INTERMEDIÁRIA: Technological Grid, Connection Vectors & Subtle Nodes */}
      <div
        className="absolute inset-0 transition-transform duration-150 ease-out will-change-transform"
        style={{
          transform: `translate3d(${mouseShiftX}px, ${midOffsetY + mouseShiftY}px, 0px)`,
        }}
      >
        <svg
          className="h-full w-full opacity-[0.14]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 1200"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <pattern
              id="spatial-tech-grid"
              width="72"
              height="72"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 72 0 L 0 0 0 72"
                fill="none"
                stroke="#1e293b"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="1440" height="1200" fill="url(#spatial-tech-grid)" />

          {/* Architectural Connection Lines */}
          <path
            d="M 144 144 L 360 144 L 432 216 L 792 216"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />
          <path
            d="M 1296 288 L 1080 288 L 1008 360 L 864 360"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="1.2"
            strokeDasharray="4 8"
          />
          <circle cx="144" cy="144" r="3" fill="#06b6d4" />
          <circle cx="432" cy="216" r="3" fill="#06b6d4" />
          <circle cx="1008" cy="360" r="3" fill="#3b82f6" />
        </svg>
      </div>
    </div>
  );
};
