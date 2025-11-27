"use client";

import { cn } from "../lib/utils";
import React, { ReactNode, useMemo } from "react";
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

  const validTags = ["div", "span", "section", "article", "p", "h1", "h2", "h3", "h4", "h5", "h6"] as const;
  type ValidTag = (typeof validTags)[number];

  const MotionComponent = motion[validTags.includes(as) ? as : "div"] as React.ElementType;

  const maskId = useMemo(() => `video-text-mask-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <MotionComponent className={cn("relative overflow-hidden", className)} {...motionProps}>
      <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="200" maskContentUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1000" height="200" fill="black" />
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

        <g mask={`url(#${maskId})`}>
          <foreignObject width="100%" height="100%">
            <video
              className="w-full h-full object-cover"
              autoPlay={autoPlay}
              muted={muted}
              loop={loop}
              preload={preload}
              playsInline
            >
              <source src={src} type="video/mp4" />
            </video>
          </foreignObject>
        </g>
      </svg>
    </MotionComponent>
  );
}
