import React from "react";
import { motion } from "framer-motion";
import { UniverseCard } from "../UniverseCard";
import AuroraButton from "../ui/AuroraButton";

type TiltDirection = "left" | "center" | "right";

type ServiceCard = {
  icon: React.ReactNode;
  title: string;
  description: string;
  glow: "blue" | "purple" | "violet" | "gold";
};

function Tilt({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [rot, setRot] = React.useState({ rx: 0, ry: 0 });
  const frameRef = React.useRef<number | null>(null);
  const pendingPos = React.useRef<{ x: number; y: number } | null>(null);
  const ref = React.useRef<HTMLDivElement>(null);

  if (disabled) return <>{children}</>;

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        pendingPos.current = {
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        };
        if (frameRef.current) return;
        frameRef.current = requestAnimationFrame(() => {
          frameRef.current = null;
          const next = pendingPos.current;
          if (!next) return;
          const rx = (0.5 - next.y) * 6;
          const ry = (next.x - 0.5) * 6;
          setRot({ rx, ry });
        });
      }}
      onMouseLeave={() => {
        pendingPos.current = null;
        frameRef.current && cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
        setRot({ rx: 0, ry: 0 });
      }}
      style={{ perspective: "1000px" }}
      className="will-change-transform"
    >
      <motion.div
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: rot.rx, rotateY: rot.ry }}
        transition={{ type: "spring", stiffness: 140, damping: 14, mass: 0.6 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

interface ServicesSectionProps {
  cards: ServiceCard[];
  disableTilt: boolean;
  onContactClick: () => void;
}

export default function ServicesSection({
  cards,
  disableTilt,
  onContactClick,
}: ServicesSectionProps) {
  return (
    <section className="py-16">
      <div
        className="max-w-6xl mx-auto px-6 text-center"
        style={{ marginTop: "2rem" }}
      >
        <div className="flex flex-col items-center" style={{ gap: "0.6rem" }}>
          <h2
            className="tracking-wide headline-gradient"
            style={{
              fontSize: "clamp(1.6rem, 3vw, 2.8rem)",
              lineHeight: 1.05,
              textTransform: "uppercase",
              color: "transparent",
              marginBottom: "0.4rem",
            }}
          >
            BODY · MIND · SOUL
          </h2>
          <div
            className="inline-flex items-center justify-center rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[0.58rem] sm:text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-white shadow-[0_0_30px_rgba(90,0,255,0.4),0_0_40px_rgba(59,130,246,0.35)] backdrop-blur-xl"
            style={{ letterSpacing: "0.16em" }}
          >
            The BMS System
          </div>
          <div
            className="text-white text-xs md:text-sm tracking-[0.22em] uppercase"
            style={{ marginBottom: "0.2rem" }}
          >
            — Three pillars for conscious performance & real transformation —
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-10 items-stretch mt-10">
          {cards.map((card, index) => {
            const tilt: TiltDirection = index === 1 ? "center" : index === 2 ? "right" : "left";
            const offset = tilt === "left" ? "-20px" : tilt === "right" ? "20px" : "0px";
            return (
              <Tilt key={card.title} disabled={disableTilt}>
                <div
                  className="relative mb-10 rounded-3xl"
                  style={{
                    transform: disableTilt
                      ? "translateX(0px) translateY(0px)"
                      : `translateX(${offset}) translateY(0px)`,
                  }}
                >
                  <div className="relative z-10">
                    <UniverseCard
                      icon={card.icon}
                      title={card.title.toUpperCase()}
                      description={card.description}
                      glowColor={card.glow}
                      delay={0.15 * index}
                      tilt={tilt}
                      cardHeight={400}
                    />
                  </div>
                </div>
              </Tilt>
            );
          })}
        </div>

        <div
          className="flex justify-center"
          style={{ marginTop: "4rem", marginBottom: "8rem" }}
        >
          <AuroraButton
            label="discover your Potential"
            className="px-10 sm:px-14 py-4 text-base tracking-[0.3em]"
            onClick={onContactClick}
          />
        </div>
      </div>
    </section>
  );
}
