"use client";

import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useMotionValue, useTransform, useMotionTemplate } from "framer-motion";
import { cn } from "../lib/utils";

type InteractiveCardProps = {
  children: ReactNode;
  className?: string;
  interactiveColor?: string;
  borderRadius?: string;
  rotationFactor?: number;
  transitionDuration?: number;
  transitionEasing?: "linear" | "easeIn" | "easeOut" | "easeInOut";
  tailwindBgClass?: string;
  containerClassName?: string; // optional: outer wrapper
};

export function InteractiveCard({
  children,
  className,
  containerClassName,
  interactiveColor = "#07eae6ff",
  borderRadius = "48px",
  rotationFactor = 0.4,
  transitionDuration = 0.3,
  transitionEasing = "easeInOut",
  tailwindBgClass = "bg-transparent backdrop-blur-md",
}: InteractiveCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useTransform(y, [0, 1], [rotationFactor * 15, -rotationFactor * 15]);
  const rotateY = useTransform(x, [0, 1], [-rotationFactor * 15, rotationFactor * 15]);

  const handlePointerMove = (e: React.PointerEvent) => {
    const bounds = cardRef.current?.getBoundingClientRect();
    if (!bounds) return;

    const px = (e.clientX - bounds.left) / bounds.width;
    const py = (e.clientY - bounds.top) / bounds.height;

    x.set(px);
    y.set(py);
  };

  const xPct = useTransform(x, (v) => `${v * 100}%`);
  const yPct = useTransform(y, (v) => `${v * 100}%`);

  const interactiveBg = useMotionTemplate`
    radial-gradient(circle at ${xPct} ${yPct}, ${interactiveColor} 0%, transparent 80%)
  `;

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => {
        setIsHovered(false);
        x.set(0.5);
        y.set(0.5);
      }}
      style={{ perspective: 1000, borderRadius }}
      className={cn("relative w-[320px] aspect-[17/21] isolate", containerClassName)}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ duration: transitionDuration, ease: transitionEasing }}
        className="w-full h-full rounded-xl overflow-hidden border shadow-lg"
      >
        {/* Hover glow */}
        <motion.div
          className="absolute inset-0 rounded-xl z-0"
          style={{ background: interactiveBg, opacity: isHovered ? 0.6 : 0 }}
          transition={{ duration: transitionDuration, ease: transitionEasing }}
          aria-hidden
        />

        {/* Content */}
        <div
          className={cn(
            "relative z-10 w-full h-full text-foreground",
            tailwindBgClass,
            className
          )}
          style={{ borderRadius }}
        >
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
