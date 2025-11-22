declare module "lightswind/dist/components/ui/smokey-cursor" {
  import type { ComponentType } from "react";

  interface ColorRGB {
    r: number;
    g: number;
    b: number;
  }

  interface SmokeyCursorProps {
    simulationResolution?: number;
    dyeResolution?: number;
    captureResolution?: number;
    densityDissipation?: number;
    velocityDissipation?: number;
    pressure?: number;
    pressureIterations?: number;
    curl?: number;
    splatRadius?: number;
    splatForce?: number;
    enableShading?: boolean;
    colorUpdateSpeed?: number;
    backgroundColor?: ColorRGB;
    transparent?: boolean;
    className?: string;
    disabled?: boolean;
    intensity?: number;
    followMouse?: boolean;
    autoColors?: boolean;
  }

  const SmokeyCursor: ComponentType<SmokeyCursorProps>;
  export default SmokeyCursor;
}
