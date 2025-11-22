"use client";

import { MouseEvent, CSSProperties } from "react";
import AuroraLogo from "./AuroraLogo";

interface AuroraButtonProps {
  label: string;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  style?: CSSProperties;
}

export default function AuroraButton({
  label,
  className = "",
  href,
  target,
  rel,
  onClick,
  style,
}: AuroraButtonProps) {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(event);
      return;
    }
    if (!href) return;

    if (target === "_blank") {
      window.open(href, "_blank", rel ?? "noopener,noreferrer");
      return;
    }

    if (href.startsWith("#")) {
      event.preventDefault();
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.location.href = href;
  };

  return (
    <button
      type="button"
      className={`neon-btn neon-btn--aurora is-purple contact-submit-btn ${className}`}
      onClick={handleClick}
      style={style}
    >
      <span className="neon-label__content">
        <span className="neon-label__text">
          <span className="neon-label__text-base">{label}</span>
          <span className="neon-label__text-aurora">
            <AuroraLogo text={label} />
          </span>
        </span>
      </span>
    </button>
  );
}
