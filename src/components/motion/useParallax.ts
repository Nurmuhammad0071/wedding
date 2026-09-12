import { useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import type { RefObject } from 'react';

/**
 * Returns a translateY MotionValue that moves `distance`px across the
 * element's journey through the viewport. Pure transform → no layout work.
 */
export function useParallax(
  ref: RefObject<HTMLElement>,
  distance = 40,
): MotionValue<number> {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  return useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [distance, -distance]);
}
