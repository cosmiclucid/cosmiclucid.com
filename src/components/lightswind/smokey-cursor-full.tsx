"use client";

import type { ComponentProps } from "react";
// changed:
import OriginalSmokeyCursor from "../ui/smokey-cursor-original";

type SmokeyCursorProps = ComponentProps<typeof OriginalSmokeyCursor>;

// ...existing code...
export default function SmokeyCursorFullScreen(props: SmokeyCursorProps) {
  return <OriginalSmokeyCursor {...props} />;
}