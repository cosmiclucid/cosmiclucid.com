import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { useVisualPointer } from '../hooks/useVisualPointer';
import './LouisPortrait.css';

const portraits = {
  portrait: { file: 'louis-portrait', alt: 'Louis Kuschnir, the creative behind Louis Lucid', width: 1122, height: 1402 },
  controller: { file: 'louis-drone-controller', alt: 'Louis Kuschnir holding a drone controller during a production', width: 1122, height: 1402 },
  gimbal: { file: 'louis-gimbal', alt: 'Louis Kuschnir holding his camera and gimbal for video production', width: 1122, height: 1402 },
  drone: { file: 'louis-drone', alt: 'Louis Kuschnir with his drone for aerial filming', width: 1536, height: 1024 },
  gimbalWide: { file: 'louis-gimbal-wide', alt: 'Louis Kuschnir with a camera mounted on a gimbal', width: 1536, height: 1024 },
  seated: { file: 'louis-seated', alt: 'Louis Kuschnir seated, looking toward the camera', width: 1536, height: 1024 },
};

export type PortraitKind = keyof typeof portraits;

export default function LouisPortrait({ kind, caption, eager = false, sizes = '(max-width: 760px) 90vw, 520px' }: {
  kind: PortraitKind;
  caption?: string;
  eager?: boolean;
  sizes?: string;
}) {
  const { file, alt, width, height } = portraits[kind];
  const base = `${import.meta.env.BASE_URL}portraits/${file}`;
  const interactive = kind === 'portrait';
  const { rotateX, rotateY, nearX, nearY, lightX, lightY, trackPointer, reset } = useVisualPointer();
  const tiltX = useTransform(rotateX, value => value * 0.3);
  const tiltY = useTransform(rotateY, value => value * 0.3);
  const glowX = useTransform(lightX, [110, 450], [20, 80]);
  const glowY = useTransform(lightY, [110, 390], [20, 80]);
  const glow = useMotionTemplate`radial-gradient(ellipse at ${glowX}% ${glowY}%, rgba(133, 63, 237, .5), rgba(50, 109, 221, .22) 38%, transparent 70%)`;
  return (
    <figure className={`louis-portrait ${width > height ? 'louis-portrait--wide' : 'louis-portrait--cutout'} ${interactive ? 'louis-portrait--interactive' : ''}`}>
      <div className="louis-portrait__image" onPointerMove={interactive ? trackPointer : undefined} onPointerLeave={interactive ? reset : undefined} onPointerCancel={interactive ? reset : undefined}>
        {interactive && <motion.div className="louis-portrait__glow" aria-hidden="true" style={{ background: glow, x: nearX, y: nearY }} />}
        <motion.div className="louis-portrait__depth" style={interactive ? { rotateX: tiltX, rotateY: tiltY } : undefined}>
          <img className={interactive ? 'louis-portrait__soft-edge' : undefined} src={`${base}-960.webp`} srcSet={`${base}-480.webp 480w, ${base}-960.webp 960w`} sizes={sizes} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} decoding="async" />
        </motion.div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
