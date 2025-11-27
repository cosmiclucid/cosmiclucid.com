"use client";

import { cn } from "../lib/utils";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface VideoTextProps {
  src: string;
  className?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: "auto" | "metadata" | "none";
  children: ReactNode;
  fontSize?: string | number;
  fontWeight?: string | number;
  textAnchor?: React.SVGAttributes<SVGTextElement>["textAnchor"];
  dominantBaseline?: React.SVGAttributes<SVGTextElement>["dominantBaseline"];
  fontFamily?: string;
  as?: "div" | "span" | "section" | "article" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function VideoText({
  src,
  children,
  className = "",
  autoPlay = true,
  muted = true,
  loop = true,
  preload = "auto",
  fontSize = 20,
  fontWeight = "bold",
  textAnchor = "middle",
  dominantBaseline = "middle",
  fontFamily = "sans-serif",
  as = "div",
  ...motionProps
}: VideoTextProps & HTMLMotionProps<"div">) {
  const content = React.Children.toArray(children).join("");
  const maskId = useMemo(() => `video-text-mask-${Math.random().toString(36).slice(2, 9)}`, []);

  const validTags = ["div", "span", "section", "article", "p", "h1", "h2", "h3", "h4", "h5", "h6"] as const;
  type ValidTag = (typeof validTags)[number];

  const MotionComponent = motion[validTags.includes(as) ? as : "div"] as React.ElementType;

  return (
    <MotionComponent className={cn("relative overflow-hidden", className)} {...motionProps}>
      <svg className="absolute inset-0 h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect width="1000" height="200" fill="black" />
            <text
              x="50%"
              y="50%"
              fontSize={fontSize}
              fontWeight={fontWeight}
              textAnchor={textAnchor}
              dominantBaseline={dominantBaseline}
              fontFamily={fontFamily}
              fill="white"
            >
              {content}
            </text>
          </mask>
        </defs>
      </svg>

      <video
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload={preload}
        playsInline
        aria-hidden="true"
        style={{
          mask: `url(#${maskId})`,
          WebkitMask: `url(#${maskId})`,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        <source src={src} type="video/mp4" />
      </video>

      <span className="sr-only">{content}</span>
    </MotionComponent>
  );
}
