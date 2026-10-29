import React, { useRef, useState } from 'react';
import { computeCardTilt } from '../utils/portfolioLogic';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  reducedMotion?: boolean;
  maxTiltDegrees?: number;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = '',
  reducedMotion = false,
  maxTiltDegrees = 5,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tiltState, setTiltState] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || e.pointerType === 'touch') return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) return;

    const normX = (e.clientX - rect.left) / rect.width - 0.5;
    const normY = (e.clientY - rect.top) / rect.height - 0.5;
    const computed = computeCardTilt(normX, normY, maxTiltDegrees);

    setTiltState({
      ...computed,
      isHovered: true,
    });
  };

  const handlePointerLeave = () => {
    setTiltState({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform:
          tiltState.isHovered && !reducedMotion
            ? `perspective(1000px) rotateX(${tiltState.rotateX}deg) rotateY(${tiltState.rotateY}deg) translateZ(4px)`
            : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
      }}
    >
      {/* Dynamic Pointer Illumination Layer */}
      {tiltState.isHovered && !reducedMotion && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-100 transition-opacity duration-200"
          style={{
            background: `radial-gradient(380px circle at ${tiltState.glareX}% ${tiltState.glareY}%, rgba(6, 182, 212, 0.11), transparent 70%)`,
          }}
        />
      )}
      {children}
    </div>
  );
};
