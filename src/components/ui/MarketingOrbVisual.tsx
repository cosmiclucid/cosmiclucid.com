"use client";

import React, { useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import {
  Instagram,
  Youtube,
  MessageCircle,
  BriefcaseBusiness,
  Megaphone,
  BarChart3,
  Sparkles,
  Users,
} from "lucide-react";
import PlasmaGlobe from "./PlasmaGlobe";

// Types
type OrbitConfig = {
  id: number;
  radiusFactor: number;
  speed: number;
  icon: React.ReactNode;
  iconSize: number;
  orbitColor?: string;
  orbitThickness?: number;
};

type MarketingOrbVisualProps = {
  size?: number;
  orbits?: OrbitConfig[];
  centerIcon?: React.ReactNode;
};

type FloatPath = {
  id: number;
  x: number[];
  y: number[];
  z: number[];
  depth: number[]; // 0..1 derived from z, used for scale/opacity
  times: number[];
};

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

// Smooth circular/orbital motion that naturally goes behind/in front of the sphere.
// `phase` makes each icon feel unique but still smooth.
const generateOrbitalPath = (
  radius: number,
  steps = 120,
  phase = 0,
  wobble = 0.08,
  inclination = 0,
  node = 0
): Omit<FloatPath, "id"> => {
  // Keep paths safely inside the orb (slightly smaller than the provided radius)
  const r = radius * 0.78;
  const zAmp = radius * 0.55;

  const xs: number[] = [];
  const ys: number[] = [];
  const zs: number[] = [];
  const depths: number[] = [];
  const times: number[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * Math.PI * 2 + phase;

    // Base circular orbit
    const baseX = Math.cos(a) * r;
    const baseY = Math.sin(a) * r;

    // Very soft wobble (kept small so icons stay within the sphere bounds)
    const w = Math.sin(a * 2 + phase * 1.7) * wobble * radius * 0.45;

    // Z drives front/back pass (behind/in front of the sphere)
    const z = Math.sin(a + phase * 0.5) * zAmp;

    // base point in local orbit space
    let x = baseX + w;
    let y = baseY + w * 0.6;
    let zz = z;

    // Rotate around X by inclination (tilt the orbit plane)
    const cosI = Math.cos(inclination);
    const sinI = Math.sin(inclination);
    const y1 = y * cosI - zz * sinI;
    const z1 = y * sinI + zz * cosI;
    y = y1;
    zz = z1;

    // Rotate around Y by node (different heading)
    const cosN = Math.cos(node);
    const sinN = Math.sin(node);
    const x2 = x * cosN + zz * sinN;
    const z2 = -x * sinN + zz * cosN;
    x = x2;
    zz = z2;

    // Normalize z to 0..1, where 1 = closest to camera
    const depth = clamp01(zz / zAmp / 2 + 0.5);

    xs.push(x);
    ys.push(y);
    zs.push(zz);
    depths.push(depth);
    times.push(t);
  }

  return { x: xs, y: ys, z: zs, depth: depths, times };
};

type ParallaxWrapperProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  strength?: number; // px translation amount
  depthStrength?: number; // z translation amount
  children: React.ReactNode;
};

const ParallaxWrapper: React.FC<ParallaxWrapperProps> = ({
  pointerX,
  pointerY,
  strength = 18,
  depthStrength = 35,
  children,
}) => {
  // Soft parallax translation
  const x = useTransform(pointerX, (v) => v * strength);
  const y = useTransform(pointerY, (v) => v * strength);

  // Creative 3D response: slight counter-rotation + push/pull in Z (reduced sensitivity + eased response)
  const rY = useTransform(pointerX, (v) => v * 5);
  const rX = useTransform(pointerY, (v) => -v * 5);
  const z = useTransform(pointerY, (v) => -v * depthStrength * 0.6);

  // tiny swirl so it feels alive (not rigid)
  const rZ = useTransform(pointerX, (v) => v * 1.2);

  return (
    <motion.div
      style={{
        x,
        y,
        z,
        rotateY: rY,
        rotateX: rX,
        rotateZ: rZ,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </motion.div>
  );
};

// Default Orbits
const defaultOrbits: OrbitConfig[] = [
  {
    id: 1,
    radiusFactor: 0.25,
    speed: 8,
    icon: <Instagram className="text-pink-400" />,
    iconSize: 22,
    orbitColor: "rgba(244,114,182,0.55)",
    orbitThickness: 2,
  },
  {
    id: 2,
    radiusFactor: 0.45,
    speed: 12,
    icon: <Youtube className="text-fuchsia-400" />,
    iconSize: 24,
    orbitColor: "rgba(217,70,239,0.45)",
    orbitThickness: 2,
  },
  {
    id: 3,
    radiusFactor: 0.65,
    speed: 15,
    icon: <MessageCircle className="text-sky-300" />,
    iconSize: 24,
    orbitColor: "rgba(96,165,250,0.5)",
    orbitThickness: 1.5,
  },
  {
    id: 4,
    radiusFactor: 0.85,
    speed: 19,
    icon: <BriefcaseBusiness className="text-indigo-300" />,
    iconSize: 24,
    orbitColor: "rgba(129,140,248,0.45)",
    orbitThickness: 1.5,
  },
  {
    id: 5,
    radiusFactor: 0.35,
    speed: 10,
    icon: <Megaphone className="text-rose-300" />,
    iconSize: 22,
    orbitColor: "rgba(244,63,94,0.45)",
    orbitThickness: 1.5,
  },
  {
    id: 6,
    radiusFactor: 0.55,
    speed: 14,
    icon: <BarChart3 className="text-emerald-300" />,
    iconSize: 23,
    orbitColor: "rgba(52,211,153,0.45)",
    orbitThickness: 1.5,
  },
  {
    id: 7,
    radiusFactor: 0.75,
    speed: 17,
    icon: <Users className="text-cyan-300" />,
    iconSize: 24,
    orbitColor: "rgba(34,211,238,0.45)",
    orbitThickness: 1.5,
  },
  {
    id: 8,
    radiusFactor: 0.88,
    speed: 21,
    icon: <Sparkles className="text-violet-300" />,
    iconSize: 22,
    orbitColor: "rgba(167,139,250,0.45)",
    orbitThickness: 1.2,
  },
];

// Component
export const MarketingOrbVisual: React.FC<MarketingOrbVisualProps> = ({
  size = 420,
  orbits: customOrbits,
  centerIcon,
}) => {
  const orbitsData = useMemo(
    () => customOrbits || defaultOrbits,
    [customOrbits]
  );
  const halfSize = size / 2;

  // Pointer-driven parallax (normalized roughly -1..1)
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  // Spring-smoothed pointer values (prevents “sticking” / snapping during fast cursor movement)
  const pointerXSmooth = useSpring(pointerX, { stiffness: 120, damping: 26, mass: 0.6 });
  const pointerYSmooth = useSpring(pointerY, { stiffness: 120, damping: 26, mass: 0.6 });

  const floatPaths = useMemo<FloatPath[]>(
    () =>
      orbitsData.map((orbit, index) => {
        // Slightly shrink all orbits so icons never exit the orb visually
        const orbitRadius = (size * orbit.radiusFactor * 0.92) / 2;
        const floatRadius = orbitRadius * 0.72;

        // Smoothness: more steps = smoother circle
        const steps = 140;

        // Evenly distribute start positions so icons don't cluster
        const phase = (index / Math.max(1, orbitsData.length)) * Math.PI * 2;

        // Keep wobble subtle and stable
        const wobble = 0.02 + (index % 5) * 0.004;

        // Put each orbit on a slightly different plane (reduces overlap/clutter)
        const inclination = (-0.42 + index * 0.14) % 0.9; // ~[-0.42..0.48] repeating
        const node = (index * 0.9) % (Math.PI * 2);

        return {
          id: orbit.id,
          ...generateOrbitalPath(floatRadius, steps, phase, wobble, inclination, node),
        };
      }),
    [orbitsData, size]
  );

  const [activeOrbitId, setActiveOrbitId] = useState<number | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1

    // map to -1..1 with center = 0, reduced normalization strength
    pointerX.set((px - 0.5) * 1.4);
    pointerY.set((py - 0.5) * 1.4);
  };

  const resetPointer = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  // Center
  const CenterIcon = (
    <motion.div
      className="grid place-content-center rounded-full bg-[radial-gradient(circle_at_30%_20%,#fef3c7_0,#f97316_25%,#a855f7_55%,#0f172a_100%)] shadow-[0_0_35px_rgba(168,85,247,0.6)]"
      style={{ width: halfSize * 0.45, height: halfSize * 0.45 }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
    >
      {centerIcon ?? (
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-md" />
          <div className="h-3 w-3 rounded-full bg-white/90 shadow-[0_0_18px_rgba(255,255,255,0.8)]" />
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="flex items-center justify-center bg-transparent">
      <motion.div
        className="relative"
        style={{ width: size, height: size, perspective: 1400, transformStyle: "preserve-3d" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        {/* Plasma background behind the orbits */}
        <div className="pointer-events-none absolute inset-0">
          <PlasmaGlobe speed={0.8} intensity={1.0} />
        </div>

        {/* Glow */}
        <div className="pointer-events-none absolute inset-[-15%] rounded-full bg-[radial-gradient(circle,#7c3aed40,transparent_60%)] blur-3xl" />

        {orbitsData.map((orbit) => {
          const isActive = activeOrbitId === orbit.id;
          const path =
            floatPaths.find((p) => p.id === orbit.id) ??
            ({
              id: orbit.id,
              x: [0],
              y: [0],
              z: [0],
              depth: [1],
              times: [0],
            } as FloatPath);

          const scales = path.depth.map((d) => 0.75 + d * 0.55 + (isActive ? 0.10 : 0));
          const opacities = path.depth.map((d) => 0.18 + d * 0.82);

          // Use depth to subtly tilt icons as they move toward/away from camera
          const tiltY = path.depth.map((d) => (d - 0.5) * 28);
          const tiltX = path.depth.map((d) => (0.5 - d) * 22);

          // Drive Z directly from generated path values (sphere volume)
          const depthZ = path.z.map((z) => z);

          return (
            <React.Fragment key={orbit.id}>
              {/* Floating 3D icon */}
              <motion.div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
                <ParallaxWrapper
                  pointerX={pointerXSmooth}
                  pointerY={pointerYSmooth}
                  // outer orbits get a bit more parallax, inner orbits less
                  strength={10 + orbit.radiusFactor * 14}
                  depthStrength={22 + orbit.radiusFactor * 40}
                >
                  <motion.div
                    className="absolute"
                    style={{
                      top: halfSize,
                      left: halfSize,
                      transformStyle: "preserve-3d",
                      perspective: 1400,
                    }}
                    animate={{
                      x: path.x,
                      y: path.y,
                      z: depthZ,
                      scale: scales,
                      opacity: opacities,
                      rotateY: tiltY,
                      rotateX: tiltX,
                      rotateZ: [0, 2, -2, 0],
                    }}
                    transition={{
                      duration: orbit.speed * 2.8,
                      repeat: Infinity,
                      ease: "linear",
                      times: path.times,
                    }}
                  >
                    <motion.div
                      className="relative flex items-center justify-center rounded-full backdrop-blur-lg bg-gradient-to-br from-white/22 via-white/10 to-white/6 border border-white/10 shadow-[0_22px_55px_rgba(0,0,0,0.38)]"
                      style={{
                        width: orbit.iconSize + 18,
                        height: orbit.iconSize + 18,
                        transformStyle: "preserve-3d",
                      }}
                      animate={{
                        rotateZ: [0, 1.5, -1.5, 0],
                        translateZ: [0, 10, 0],
                      }}
                      transition={{
                        duration: orbit.speed * 3.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: path.times,
                      }}
                      whileHover={{
                        scale: 1.22,
                        filter: "drop-shadow(0 0 22px rgba(255,255,255,0.8))",
                        translateZ: 60,
                      }}
                      onHoverStart={() => setActiveOrbitId(orbit.id)}
                      onHoverEnd={() => setActiveOrbitId(null)}
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/38 via-white/10 to-white/0 opacity-80 blur-md pointer-events-none" />
                      <div className="absolute -inset-[20%] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.3),transparent_70%)] opacity-65 pointer-events-none" />
                      <div className="absolute inset-[-8%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.4),transparent_55%)] opacity-70 blur-[10px] pointer-events-none" />

                      <div className="relative" style={{ transformStyle: "preserve-3d" }}>
                        <div style={{ transform: "translate3d(0,0,18px)" }}>
                          {React.cloneElement(orbit.icon as any, {
                            size: orbit.iconSize,
                            className:
                              "drop-shadow-[0_10px_24px_rgba(0,0,0,0.65)] text-white",
                          })}
                        </div>

                        {/* specular highlight */}
                        <div
                          className="pointer-events-none absolute -inset-1 rounded-full"
                          style={{
                            transform: "translate3d(-3px,-4px,24px)",
                            background:
                              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.50), rgba(255,255,255,0) 60%)",
                            opacity: 0.55,
                          }}
                        />
                      </div>
                    </motion.div>
                  </motion.div>
                </ParallaxWrapper>
              </motion.div>
            </React.Fragment>
          );
        })}

        {/* Center */}
        <div className="absolute inset-0 grid place-content-center z-10">
          {CenterIcon}
        </div>
      </motion.div>
    </div>
  );
};
