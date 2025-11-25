"use client";

import type { ComponentProps } from "react";
import OriginalSmokeyCursor from "../ui/smokey-cursor-original";
import { useClientEnv } from "../../hooks/useClientEnv";

type SmokeyCursorProps = ComponentProps<typeof OriginalSmokeyCursor>;

export default function SmokeyCursorFullScreen(props: SmokeyCursorProps) {
  const { isMobile, isSmallScreen, prefersReducedMotion } = useClientEnv();
  const disabled = isMobile || isSmallScreen || prefersReducedMotion || props.disabled;

  if (disabled) return null;

  return (
    <OriginalSmokeyCursor
      {...props}
      simulationResolution={Math.min(props.simulationResolution ?? 128, isSmallScreen ? 64 : 128)}
      dyeResolution={Math.min(props.dyeResolution ?? 1440, isSmallScreen ? 720 : 1024)}
      disabled={disabled}
    />
  );
}
