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
  const { style, ...restMotionProps } = motionProps;
  const fontSizeValue = typeof fontSize === "number" ? `${fontSize}px` : fontSize;

  const validTags = ["div", "span", "section", "article", "p", "h1", "h2", "h3", "h4", "h5", "h6"] as const;
  type ValidTag = (typeof validTags)[number];

  const MotionComponent = motion[validTags.includes(as) ? as : "div"] as React.ElementType;

  const maskImage = useMemo(() => {
    const svgMask = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="1000" height="200" fill="black" />
        <text
          x="50%"
          y="50%"
          text-anchor="${textAnchor}"
          dominant-baseline="${dominantBaseline}"
          fill="white"
          style="font-size:${fontSizeValue}; font-weight:${fontWeight}; font-family:${fontFamily};"
        >
          ${content}
        </text>
      </svg>
    `;
    return `url("data:image/svg+xml;utf8,${encodeURIComponent(svgMask)}")`;
  }, [content, dominantBaseline, fontFamily, fontSizeValue, fontWeight, textAnchor]);

  return (
    <MotionComponent
      className={cn("relative overflow-hidden", className)}
      style={{
        WebkitMaskImage: maskImage,
        maskImage,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        ...style,
      }}
      aria-label={content}
      {...restMotionProps}
    >
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        preload={preload}
        playsInline
      >
        <source src={src} type="video/mp4" />
      </video>
      <span aria-hidden className="invisible select-none">
        {content}
      </span>
    </MotionComponent>
  );
}
