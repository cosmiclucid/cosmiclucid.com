"use client";

import React, { useMemo, useState } from "react";
import { motion, Transition } from "motion/react";
import {
  Instagram,
  Youtube,
  MessageCircle,
  BriefcaseBusiness,
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

  const [activeOrbitId, setActiveOrbitId] = useState<number | null>(null);

  const linearEase = (t: number) => t;
  const rotationTransition = (duration: number, isActive = false): Transition => ({
    repeat: Infinity,
    duration: isActive ? duration * 0.7 : duration,
    ease: linearEase,
  });

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
        style={{ width: size, height: size }}
      >
        {/* Plasma background behind the orbits */}
        <PlasmaGlobe speed={0.8} intensity={1.0} />

        {/* Glow */}
        <div className="pointer-events-none absolute inset-[-15%] rounded-full bg-[radial-gradient(circle,#7c3aed40,transparent_60%)] blur-3xl" />

        {orbitsData.map((orbit) => {
          const orbitDiameter = size * orbit.radiusFactor;
          const orbitRadius = orbitDiameter / 2;
          const isActive = activeOrbitId === orbit.id;

          return (
            <React.Fragment key={orbit.id}>
              {/* Orbit Circle */}
              <div
                className="absolute rounded-full"
                style={{
                  width: orbitDiameter,
                  height: orbitDiameter,
                  top: halfSize - orbitRadius,
                  left: halfSize - orbitRadius,
                  borderWidth: orbit.orbitThickness,
                  borderStyle: "solid",
                  borderColor: orbit.orbitColor,
                  borderRadius: "9999px",
                }}
              />

              {/* Rotating Icon */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={rotationTransition(orbit.speed, isActive)}
              >
                <div
                  className="absolute"
                  style={{
                    top: halfSize,
                    left: halfSize + orbitRadius,
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <motion.div
                    className="flex items-center justify-center rounded-full bg-[rgba(15,23,42,0.8)] border border-white/10"
                    style={{
                      width: orbit.iconSize + 16,
                      height: orbit.iconSize + 16,
                      boxShadow: isActive
                        ? "0 0 28px rgba(255,255,255,0.8)"
                        : "0 0 18px rgba(168,85,247,0.55)",
                    }}
                    animate={{
                      scale: isActive ? [1, 1.15, 1] : [0.97, 1.03, 0.97],
                      opacity: [0.9, 1, 0.95],
                    }}
                    transition={rotationTransition(orbit.speed, isActive)}
                    onHoverStart={() => setActiveOrbitId(orbit.id)}
                    onHoverEnd={() => setActiveOrbitId(null)}
                    whileHover={{ scale: 1.22 }}
                  >
                    {React.cloneElement(orbit.icon as any, {
                      size: orbit.iconSize,
                    })}
                  </motion.div>
                </div>
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
