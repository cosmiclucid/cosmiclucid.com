"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type ThreeDImageRingProps = {
  /** Image URLs (use leading slash if in /public) */
  images: string[];

  /** Stage width (height = width) */
  width?: number;

  /** Camera perspective in px (smaller = stronger 3D) */
  perspective?: number;

  /** Radius / Z distance of tiles */
  imageDistance?: number;

  /** Tile size in px (defaults to width * 0.62) */
  tileSize?: number;

  /** Tile aspect ratio (width / height). 1 = square */
  tileAspectRatio?: number;

  /** Initial ring rotation in degrees */
  initialRotation?: number;

  /** Drag sensitivity (deg per px) */
  dragSensitivity?: number;

  /** Idle auto-rotate speed in deg/sec (0 disables) */
  idleRotateDegPerSec?: number;

  /** Dim non-hovered tiles to this opacity */
  hoverOpacity?: number;

  /** Make panels face outward (recommended true) */
  faceOutward?: boolean;

  /** Mobile breakpoint (px) and scale factor (0–1) */
  mobileBreakpoint?: number;
  mobileScaleFactor?: number;

  /** Optional className hooks */
  containerClassName?: string;
  ringClassName?: string;
  tileClassName?: string;
};

export default function ThreeDImageRing({
  images,
  width = 320,
  perspective = 1200,
  imageDistance = 480,
  tileSize, // default below
  initialRotation = -20,
  dragSensitivity = 0.25,
  tileAspectRatio = 1,
  idleRotateDegPerSec = 4,
  hoverOpacity = 0.5,
  faceOutward = true,
  mobileBreakpoint = 768,
  mobileScaleFactor = 0.85,
  containerClassName,
  ringClassName,
  tileClassName,
}: ThreeDImageRingProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
    const TILE_SELECTOR = '[data-ring-tile="true"]';

  // rotation state
  const rotation = useRef(initialRotation);
  const [rot, setRot] = useState(initialRotation);

  // drag state
  const dragging = useRef(false);
  const lastX = useRef(0);

  // responsive scale
  const [scale, setScale] = useState(1);

  // derived
  const angle = useMemo(() => 360 / Math.max(images.length, 1), [images.length]);
  const baseTile = tileSize ?? Math.round(width * 0.62);
  const tileWidth = baseTile * scale;
  const safeAspect = tileAspectRatio > 0 ? tileAspectRatio : 1;
  const tileHeight = tileWidth / safeAspect;
  const radius = imageDistance * scale;

  // responsive listener
  useEffect(() => {
    const onResize = () => {
      const s = window.innerWidth <= mobileBreakpoint ? mobileScaleFactor : 1;
      setScale(s);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [mobileBreakpoint, mobileScaleFactor]);

  const updateRotation = () => {
    setRot(rotation.current);
  };

  // gentle idle rotation loop (no inertia)
  useEffect(() => {
    if (idleRotateDegPerSec === 0) return;

    let rafId: number | null = null;
    let prev = performance.now();

    const tick = (now: number) => {
      const dt = (now - prev) / 1000;
      prev = now;

      if (!dragging.current) {
        rotation.current += idleRotateDegPerSec * dt;
        setRot(rotation.current);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [idleRotateDegPerSec]);

  // pointer handlers
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const stopDragging = () => {
      dragging.current = false;
      activePointerId.current = null;
      if (ringRef.current) ringRef.current.style.cursor = "grab";
      updateRotation();
    };

    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || !target.closest(TILE_SELECTOR)) return;

      e.preventDefault();
      const tileTarget = target.closest(TILE_SELECTOR) as HTMLElement | null;
      if (tileTarget?.dataset.ringTransform) {
        tileTarget.style.transform = tileTarget.dataset.ringTransform;
      }
      dragging.current = true;
      activePointerId.current = e.pointerId;
      lastX.current = e.clientX;
      if (ringRef.current) ringRef.current.style.cursor = "grabbing";
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging.current || activePointerId.current !== e.pointerId) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;

      const deltaDeg = -dx * dragSensitivity;
      rotation.current += deltaDeg;
      updateRotation();
    };

    const onUp = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return;
      stopDragging();
    };

    const onCancel = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return;
      stopDragging();
    };

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [dragSensitivity]);

  // hover dim handlers (kept super simple)
  const dimOthers = (index: number) => {
    const ring = ringRef.current;
    if (!ring) return;
    Array.from(ring.children).forEach((el, i) => {
      (el as HTMLElement).style.opacity = i === index ? "1" : String(hoverOpacity);
    });
  };
  const resetDim = () => {
    const ring = ringRef.current;
    if (!ring) return;
    Array.from(ring.children).forEach((el) => ((el as HTMLElement).style.opacity = "1"));
  };

  const stageWidth = width * scale;
  const stageHeight = Math.max(stageWidth, tileHeight + 40); // allow taller tiles

  const stageStyle: React.CSSProperties = {
    perspective: `${perspective}px`,
    width: `${stageWidth}px`,
    height: `${stageHeight}px`,
    position: "relative",
  };

  const ringStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    transformStyle: "preserve-3d",
    transform: `translateZ(-200px) rotateY(${rot}deg)`,
    cursor: "grab",
    willChange: "transform",
  };

  return (
    <div
      ref={stageRef}
      className={containerClassName}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "visible",
        touchAction: "pan-y",
      }}
    >
      <div style={stageStyle}>
        <div ref={ringRef} className={ringClassName} style={ringStyle}>
          {images.map((src, i) => {
            // arrange around the Y axis
            const base = `translate(-50%, -50%) rotateY(${i * angle}deg) translateZ(${radius}px)`;
            const faceFix = faceOutward ? " rotateY(180deg)" : ""; // make tile face viewer
            const panelTransform = base + faceFix;

            return (
              <div
                key={i}
                className={tileClassName}
                data-ring-tile="true"
                data-ring-transform={panelTransform}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: `${tileWidth}px`,
                  height: `${tileHeight}px`,
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  transform: panelTransform,
                  borderRadius: 12,
                  overflow: "hidden",
                  boxShadow: "0 8px 24px rgba(0,0,0,.25)",
                  transition: "transform 0.25s ease-out",
                }}
                onMouseEnter={(event) => {
                  if (dragging.current) return;
                  dimOthers(i);
                  const el = event.currentTarget as HTMLElement;
                  el.style.transform = `${panelTransform} translateZ(90px) scale(1.08)`;
                }}
                onMouseLeave={(event) => {
                  if (dragging.current) return;
                  resetDim();
                  const el = event.currentTarget as HTMLElement;
                  el.style.transform = panelTransform;
                }}
              >
                <img
                  src={src}
                  alt={`ring-${i}`}
                  loading="eager"
                  draggable={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    backfaceVisibility: "hidden",
                  }}
                  onDragStart={(event) => event.preventDefault()}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
