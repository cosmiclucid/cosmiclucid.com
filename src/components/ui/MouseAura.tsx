import { useEffect, useMemo, useRef } from 'react';

type BlobConfig = {
  id: string;
  size: number;
  blur: number;
  opacity: number;
  lag: number;
  swirlRadius: number;
  swirlSpeed: number;
  baseColor: string;
  midColor: string;
  edgeColor: string;
};

const BLOB_CONFIG: BlobConfig[] = [
  {
    id: 'primary',
    size: 420,
    blur: 90,
    opacity: 0.42,
    lag: 0.18,
    swirlRadius: 30,
    swirlSpeed: 0.6,
    baseColor: 'rgba(58, 8, 94, 1)',
    midColor: 'rgba(94, 63, 201, 0.9)',
    edgeColor: 'rgba(9, 9, 35, 0)',
  },
  {
    id: 'secondary',
    size: 360,
    blur: 75,
    opacity: 0.36,
    lag: 0.12,
    swirlRadius: 50,
    swirlSpeed: 0.8,
    baseColor: 'rgba(16, 37, 122, 1)',
    midColor: 'rgba(24, 119, 198, 0.85)',
    edgeColor: 'rgba(6, 12, 31, 0)',
  },
  {
    id: 'tertiary',
    size: 540,
    blur: 120,
    opacity: 0.32,
    lag: 0.07,
    swirlRadius: 80,
    swirlSpeed: 0.45,
    baseColor: 'rgba(28, 0, 61, 1)',
    midColor: 'rgba(84, 21, 197, 0.65)',
    edgeColor: 'rgba(4, 8, 21, 0)',
  },
];

const prefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const isTouchDevice = () =>
  typeof window !== 'undefined' &&
  ('ontouchstart' in window || navigator.maxTouchPoints > 0);

export function MouseAura() {
  const shouldDisable = useMemo(() => prefersReducedMotion() || isTouchDevice(), []);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (shouldDisable) {
      return;
    }

    const pointer = {
      x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    };

    const blobs = BLOB_CONFIG.map(() => ({
      x: pointer.x,
      y: pointer.y,
    }));
    const timeRef = { current: 0 };

    let rafId: number | null = null;

    const handlePointerMove = (event: PointerEvent | MouseEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const animate = () => {
      timeRef.current += 0.016;
      blobs.forEach((blobState, index) => {
        const config = BLOB_CONFIG[index];
        const targetX = pointer.x;
        const targetY = pointer.y;

        blobState.x += (targetX - blobState.x) * config.lag;
        blobState.y += (targetY - blobState.y) * config.lag;

        const node = blobRefs.current[index];
        if (node) {
          const swirlX =
            Math.cos(timeRef.current * config.swirlSpeed + index * 0.8) *
            config.swirlRadius;
          const swirlY =
            Math.sin(timeRef.current * (config.swirlSpeed * 0.85) + index * 1.1) *
            config.swirlRadius *
            0.6;

          node.style.transform = `translate3d(${blobState.x + swirlX - config.size / 2}px, ${
            blobState.y + swirlY - config.size / 2
          }px, 0)`;
        }
      });

      rafId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
    };
  }, [shouldDisable]);

  if (shouldDisable) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden mix-blend-screen"
      aria-hidden
    >
      {BLOB_CONFIG.map((blob, index) => (
        <div
          key={blob.id}
          ref={(node) => {
            blobRefs.current[index] = node;
          }}
          className="absolute rounded-full mix-blend-screen"
          style={{
            width: blob.size,
            height: blob.size,
            filter: `blur(${blob.blur}px)`,
            opacity: blob.opacity,
            background: `radial-gradient(circle at 32% 28%, ${blob.baseColor} 0%, ${blob.midColor} 35%, ${blob.edgeColor} 75%)`,
            transform: `translate3d(${(typeof window !== 'undefined' ? window.innerWidth : 0) / 2}px, ${
              (typeof window !== 'undefined' ? window.innerHeight : 0) / 2
            }px, 0)`,
          }}
        />
      ))}
    </div>
  );
}

export default MouseAura;
