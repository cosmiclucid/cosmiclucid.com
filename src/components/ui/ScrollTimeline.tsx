"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { VideoText, VideoTextProps } from "./VideoText";

export interface TimelineEvent {
  id?: string;
  year: string;
  title: string;
  subtitle?: string;
  description: string;
}

export interface TimelineFinalCard {
  title: string;
  subtitle?: string;
  paragraphs: string[];
  videoText?: Omit<VideoTextProps, "children">;
  titleFontSize?: VideoTextProps["fontSize"];
  titleHeight?: string | number;
  titleMarginTop?: string | number;
  titleMarginBottom?: string | number;
}

export interface ScrollTimelineProps {
  events: TimelineEvent[];
  title?: string;
  subtitle?: string;
  finalCard?: TimelineFinalCard;
  ctaSlot?: React.ReactNode;
}

export const ScrollTimeline: React.FC<ScrollTimelineProps> = ({
  events,
  title,
  subtitle,
  finalCard,
  ctaSlot,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [ctaOffset, setCtaOffset] = useState<number | null>(null);
  const ctaDotRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<HTMLDivElement[]>([]);
  const [dotOffsets, setDotOffsets] = useState<number[]>([]);
  const [cometPos, setCometPos] = useState(0);
  const CTA_EARLY_OFFSET = 0; // pull comet/line upward so it reaches CTA sooner; tweak as needed
  const COMET_OFFSET = 0;
  const PROGRESS_ACCEL = 1.25; // >1 makes the comet/line advance faster relative to scroll

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start 0.3", "end center"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);
  const lineHeight = useTransform(smoothProgress, (v) => {
    if (ctaOffset !== null) {
      const accelerated = Math.min(1, v * PROGRESS_ACCEL);
      const target = Math.max(ctaOffset + CTA_EARLY_OFFSET, 0);
      return `${(accelerated * target).toFixed(3)}px`;
    }
    return `${(v * 100).toFixed(2)}%`;
  });
  const cometTop = useTransform(smoothProgress, (v) => {
    if (ctaOffset !== null) {
      const accelerated = Math.min(1, v * PROGRESS_ACCEL);
      const target = Math.max(ctaOffset + CTA_EARLY_OFFSET, 0);
      return `${(accelerated * target + COMET_OFFSET).toFixed(2)}px`;
    }
    return `${(v * 100).toFixed(2)}%`;
  });

  // track which dot/card is "active"
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((v) => {
      const maxIndex = events.length - 1;
      const newIndex = Math.min(maxIndex, Math.floor(v * (events.length + 0.0001)));
      if (newIndex >= 0 && newIndex <= maxIndex) {
        setActiveIndex((prev) => (newIndex !== prev ? newIndex : prev));
      }

      // derive comet position in px relative to inner timeline
      const innerHeight = innerRef.current?.getBoundingClientRect().height ?? 0;
      const target = ctaOffset !== null ? Math.max(ctaOffset + CTA_EARLY_OFFSET, 0) : innerHeight;
      const accelerated = Math.min(1, v * PROGRESS_ACCEL);
      const cometY = accelerated * target + COMET_OFFSET;
      setCometPos(cometY);
      setIsAtEnd(ctaOffset !== null ? accelerated >= 0.999 : v >= 0.995);
    });
    return () => unsubscribe();
  }, [scrollYProgress, events.length, ctaOffset]);

  // Measure CTA dot position relative to timeline for comet alignment
  useLayoutEffect(() => {
    const computeOffset = () => {
      if (!innerRef.current || !ctaDotRef.current) return;
      const innerRect = innerRef.current.getBoundingClientRect();
      const dotRect = ctaDotRef.current.getBoundingClientRect();
      const offset = dotRect.top + dotRect.height / 2 - innerRect.top;
      setCtaOffset(offset);
    };
    computeOffset();
    window.addEventListener("resize", computeOffset);
    window.addEventListener("orientationchange", computeOffset);
    return () => {
      window.removeEventListener("resize", computeOffset);
      window.removeEventListener("orientationchange", computeOffset);
    };
  }, []);

  // Measure timeline dots relative to inner container
  useLayoutEffect(() => {
    const computeDotOffsets = () => {
      if (!innerRef.current) return;
      const innerRect = innerRef.current.getBoundingClientRect();
      const offsets = dotRefs.current.map((el) => {
        if (!el) return 0;
        const rect = el.getBoundingClientRect();
        return rect.top + rect.height / 2 - innerRect.top;
      });
      setDotOffsets(offsets);
    };
    // measure after paint and on resize/orientation/layout changes
    const raf = requestAnimationFrame(computeDotOffsets);
    const ro = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => computeDotOffsets())
      : null;
    if (ro && innerRef.current) ro.observe(innerRef.current);
    window.addEventListener("resize", computeDotOffsets);
    window.addEventListener("orientationchange", computeDotOffsets);
    window.addEventListener("load", computeDotOffsets);
    return () => {
      cancelAnimationFrame(raf);
      if (ro && innerRef.current) ro.unobserve(innerRef.current);
      ro?.disconnect();
      window.removeEventListener("resize", computeDotOffsets);
      window.removeEventListener("orientationchange", computeDotOffsets);
      window.removeEventListener("load", computeDotOffsets);
    };
  }, [events.length, ctaOffset]);

  // simple variant factory for reveal animation
  const getCardVariants = (index: number) => {
    const delay = index * 0.15;
    return {
      initial: { opacity: 0, y: 30 },
      whileInView: {
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.7,
          delay,
          ease: [0.42, 0, 0.58, 1], // cubic-bezier for "easeInOut"
        },
      },
    };
  };

  const toCssSize = (value?: string | number) => {
    if (value === undefined) return undefined;
    return typeof value === "number" ? `${value}px` : value;
  };

  const renderFinalCardTitle = () => {
    if (!finalCard) return null;
    const resolvedHeight = toCssSize(finalCard.titleHeight);
    const resolvedMarginTop = toCssSize(finalCard.titleMarginTop);
    const resolvedMarginBottom = toCssSize(finalCard.titleMarginBottom);
    const baseTitleStyle =
      resolvedHeight || resolvedMarginTop || resolvedMarginBottom
        ? ({
            ...(resolvedHeight ? { height: resolvedHeight } : {}),
            ...(resolvedMarginTop ? { marginTop: resolvedMarginTop } : {}),
            ...(resolvedMarginBottom ? { marginBottom: resolvedMarginBottom } : {}),
          } as React.CSSProperties)
        : undefined;

    const fallbackTitleStyle =
      baseTitleStyle || finalCard.titleFontSize !== undefined
        ? {
            ...(baseTitleStyle ?? {}),
            ...(finalCard.titleFontSize !== undefined
              ? { fontSize: finalCard.titleFontSize }
              : {}),
          }
        : undefined;

    if (!finalCard.videoText) {
      return (
        <h3 className="scroll-timeline-card-title" style={fallbackTitleStyle}>
          {finalCard.title}
        </h3>
      );
    }

    const { className, fontSize, ...videoTextProps } = finalCard.videoText;
    const mergedClassName = ["scroll-timeline-final-title", className]
      .filter(Boolean)
      .join(" ");

    return (
      <VideoText
        {...videoTextProps}
        className={mergedClassName}
        fontSize={finalCard.titleFontSize ?? fontSize}
        style={baseTitleStyle}
      >
        {finalCard.title}
      </VideoText>
    );
  };

  return (
    <div
      ref={scrollRef}
      className="scroll-timeline"
    >
      {/* Header */}
      {(title || subtitle) && (
        <div className="scroll-timeline-header">
          {title && <h2 className="scroll-timeline-title">{title}</h2>}
          {subtitle && (
            <p className="scroll-timeline-subtitle">{subtitle}</p>
          )}
        </div>
      )}

      <div className="scroll-timeline-inner" ref={innerRef}>
        {/* Static center line */}
        <div className="scroll-timeline-line" />

        {/* Progress line + comet */}
        <motion.div
          className="scroll-timeline-progress"
          style={{ height: lineHeight }}
        />
        <motion.div
          className="scroll-timeline-comet-wrapper"
          style={{ top: cometTop }}
        >
          <motion.div
            key={isAtEnd ? "comet-burst" : "comet-loop"}
            className="scroll-timeline-comet"
            animate={
              isAtEnd
                ? { scale: [1, 1.7, 2.3], opacity: [1, 0.95, 0] }
                : { scale: [1, 1.25, 1], opacity: 1 }
            }
            transition={
              isAtEnd
                ? { duration: 0.9, ease: "easeOut" }
                : { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }
          />
          {isAtEnd && (
            <motion.div
              className="scroll-timeline-comet-explosion"
              initial={{ scale: 0.8, opacity: 0.35 }}
              animate={{ scale: [1, 2.8], opacity: [0.35, 0] }}
              transition={{ duration: 0.95, ease: "easeOut" }}
            />
          )}
        </motion.div>

        {/* Events */}
        <div className="scroll-timeline-events">
          {events.map((event, index) => (
            <div
              key={event.id || index}
              className={`scroll-timeline-item ${
                index % 2 === 0
                  ? "scroll-timeline-item--left"
                  : "scroll-timeline-item--right"
              }`}
              style={index === 0 ? { marginTop: "8rem" } : undefined}
            >
              {/* Dot on center line */}
              <div className="scroll-timeline-dot-wrapper">
                {(() => {
                  const isMeasured = dotOffsets.length === events.length && dotOffsets[index] !== undefined;
                  const threshold = isMeasured ? dotOffsets[index] - 12 : Infinity; // light only when comet passes
                  const isLit = isMeasured && cometPos >= threshold;
                  return (
                  <motion.div
                    className={`scroll-timeline-dot ${
                        isLit ? "scroll-timeline-dot--active scroll-timeline-dot--lit" : ""
                  }`}
                    ref={(el) => {
                      dotRefs.current[index] = el as HTMLDivElement;
                    }}
                    animate={
                    isLit
                      ? {
                          scale: [1, 1.3, 1],
                          boxShadow: [
                            "0 0 0px rgba(99,102,241,0)",
                            "0 0 14px rgba(99,102,241,0.7)",
                            "0 0 0px rgba(99,102,241,0)",
                          ],
                        }
                      : {}
                    }
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      repeatDelay: 4,
                      ease: "easeInOut",
                    }}
                  />
                  );
                })()}
              </div>

              {/* Card */}
      <motion.article
        className="scroll-timeline-card timeline-card heavy-blur"
                variants={getCardVariants(index)}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: false, margin: "-100px" }}
              >
                <h3 className="scroll-timeline-card-title">{event.title}</h3>
                {event.year && (
                  <div className="scroll-timeline-year">{event.year}</div>
                )}
                {event.subtitle && (
                  <p className="scroll-timeline-card-subtitle">
                    {event.subtitle}
                  </p>
                )}
                <p className="scroll-timeline-card-text">
                  {event.description}
                </p>
              </motion.article>
            </div>
          ))}
        </div>

        {finalCard && (
          <motion.div
            className="scroll-timeline-final-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.42, 0, 0.58, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="scroll-timeline-final-connector" aria-hidden="true">
              <div className="scroll-timeline-final-line" />
              <div
                className={`scroll-timeline-dot scroll-timeline-dot--active scroll-timeline-dot--final${
                  isAtEnd ? " scroll-timeline-dot--lit" : ""
                }`}
              />
            </div>

            <article
            className="scroll-timeline-card scroll-timeline-final-card-content timeline-card heavy-blur"
            >
              {renderFinalCardTitle()}
              {finalCard.subtitle && (
                <div className="scroll-timeline-year">{finalCard.subtitle}</div>
              )}
              {finalCard.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="scroll-timeline-card-text scroll-timeline-final-text"
                >
                  {paragraph}
                </p>
              ))}
            </article>
          </motion.div>
        )}

        {ctaSlot && (
          <div
            className={`scroll-timeline-cta-block${
              isAtEnd ? " scroll-timeline-cta-block--active" : ""
            }`}
          >
            <div className="scroll-timeline-cta-line" />
            <div className="scroll-timeline-cta-slot">
              <div className="scroll-timeline-cta-dot" ref={ctaDotRef} />
              {ctaSlot}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
