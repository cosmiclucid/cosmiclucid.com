import { useEffect, type PointerEvent } from 'react';
import { useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';

export function useVisualPointer() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 110, damping: 22 });
  const y = useSpring(pointerY, { stiffness: 110, damping: 22 });
  const rotateX = useTransform(y, [-1, 1], [7, -7]);
  const rotateY = useTransform(x, [-1, 1], [-9, 9]);
  const nearX = useTransform(x, [-1, 1], [-16, 16]);
  const nearY = useTransform(y, [-1, 1], [-10, 10]);
  const farX = useTransform(x, [-1, 1], [9, -9]);
  const farY = useTransform(y, [-1, 1], [6, -6]);
  const lightX = useTransform(x, [-1, 1], [110, 450]);
  const lightY = useTransform(y, [-1, 1], [110, 390]);

  useEffect(() => {
    if (reducedMotion) {
      pointerX.set(0);
      pointerY.set(0);
    }
  }, [reducedMotion, pointerX, pointerY]);

  const reset = () => { pointerX.set(0); pointerY.set(0); };
  const trackPointer = (event: PointerEvent<HTMLDivElement>) => {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2)));
    pointerY.set(Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2)));
  };

  return { rotateX, rotateY, nearX, nearY, farX, farY, lightX, lightY, trackPointer, reset };
}
