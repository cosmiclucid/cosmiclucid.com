import React from "react";

type Props = {
  children?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  width?: number;   // visual size control
  height?: number;  // visual size control
};

export default function GalaxyButton({
  children = "Galaxy button!",
  href,
  onClick,
  className = "",
  width = 320,
  height = 140,
}: Props) {
  const BtnTag: any = href ? "a" : "button";

  return (
    <BtnTag
      href={href}
      onClick={onClick}
      className={`galaxy-btn relative isolate inline-flex items-center justify-center rounded-xl overflow-hidden font-semibold text-white tracking-wide ${className}`}
      style={
        {
          "--gb-w": `${width}px`,
          "--gb-h": `${height}px`,
        } as React.CSSProperties
      }
    >
      <span className="relative z-10 opacity-90 transition-opacity duration-500">
        {children}
      </span>

      {/* starfield iframe as background */}
      <iframe
        title="galaxy-stars"
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
        style={{ width: 512, height: 512, border: 0, filter: "blur(5px)", opacity: 0.55, transform: "translate(-50%,-50%) scale(1) rotate(15deg)" }}
        src="data:text/html;base64,PGh0bWw+CiAgICAgICAgICAgIDxoZWFkPgogICAgICAgICAgICAgICAgPG1ldGEgbmFtZT0idmlld3BvcnQiIGNvbnRlbnQ9IndpZHRoPWRldmljZS13aWR0aCwgaW5pdGlhbC1zY2FsZT0xIj4KICAgICAgICAgICAgICAgIDxz...<snip>...b2R5Pgo8L2h0bWw+"
      />
    </BtnTag>
  );
}

