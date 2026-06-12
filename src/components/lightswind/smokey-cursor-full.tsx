"use client";

import type { ComponentProps } from "react";
import OriginalSmokeyCursor from "../ui/smokey-cursor-original";

type SmokeyCursorProps = ComponentProps<typeof OriginalSmokeyCursor>;

export default function SmokeyCursorFullScreen(props: SmokeyCursorProps) {
  if (props.disabled) return null;

  return (
    <OriginalSmokeyCursor
      {...props}
      simulationResolution={Math.min(props.simulationResolution ?? 128, 128)}
      dyeResolution={Math.min(props.dyeResolution ?? 1024, 1024)}
    />
  );
}
