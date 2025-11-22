import React from "react";
import { auroraBase } from "../../config/auroraColors";

type Props = {
  text?: string;
  className?: string;
};

const HIGHLIGHT_PEAK = "rgba(0, 188, 255, 0.75)";
const HIGHLIGHT_SOFT = "rgba(0, 169, 255, 0.25)";

export default function AuroraLogo({ text = "COSMICLUCID", className = "" }: Props) {
  return (
    <span className={`aurora-logo-text ${className}`}>
      {text}
      <style>{`
        .aurora-logo-text{
          font: inherit;
          font-weight: 800;
          letter-spacing: inherit;
          line-height: 1;
          filter: brightness(1.45) saturate(1.55) contrast(1.15);
          text-shadow: 0 0 0.6em rgba(0, 7, 142, 0.35), 0 0 0.9em rgba(28, 0, 170, 0.4), 0 0 1.2em rgba(85, 0, 255, 0.45);
          color: transparent;
          -webkit-text-fill-color: transparent;
          -webkit-background-clip: text;
                  background-clip: text;

          background-image:
            radial-gradient(circle at 50% 50%, rgba(0, 162, 255, 0) 0%, ${HIGHLIGHT_SOFT} 30%, ${HIGHLIGHT_PEAK} 50%, ${HIGHLIGHT_SOFT} 75%, rgba(0, 162, 255, 0) 100%),
            linear-gradient(90deg, ${auroraBase.start}, ${auroraBase.end});

          background-size: 320% 320%, 100% 100%;
          background-position: 0% 50%, 50% 50%;
          background-repeat: repeat no-repeat;
          background-blend-mode: screen, normal;
          will-change: background-position, background-size;
          transform: translateZ(0);

          animation: aurora-highlight 16s linear infinite, aurora-bg-zoom 18s ease-in-out infinite alternate;
          display: inline-block;
        }

        @keyframes aurora-highlight{
          0% { background-position: 160% 50%, 0% 0%; }
          100% { background-position: -160% 50%, 0% 0%; }
        }

        @keyframes aurora-bg-zoom{
          0%   { background-size: 220% 220%, 100% 100%; }
          50%  { background-size: 260% 260%, 100% 100%; }
          100% { background-size: 220% 220%, 100% 100%; }
        }
      `}</style>
    </span>
  );
}
