import { motion } from 'framer-motion';
import { useRef, type CSSProperties } from 'react';
import { useParallax } from '../motion/useParallax';
import styles from './Floral.module.css';

type Kind = 'a' | 'b';

interface Props {
  kind: Kind;
  /** CSS width (e.g. '46vw' or 'clamp(…)') */
  width: string;
  className?: string;
  style?: CSSProperties;
  flipX?: boolean;
  flipY?: boolean;
  /** parallax travel distance in px (0 disables) */
  parallax?: number;
  priority?: boolean;
  /** render in normal flow (inside a positioned wrapper) instead of absolute */
  inline?: boolean;
}

const SRC: Record<Kind, { sm: string; lg: string; ratio: number }> = {
  a: { sm: '/florals/floral-a-sm.webp', lg: '/florals/floral-a.webp', ratio: 960 / 951 },
  b: { sm: '/florals/floral-b-sm.webp', lg: '/florals/floral-b.webp', ratio: 648 / 1117 },
};

/**
 * Paper-cut floral cluster (from the reference). Purely decorative.
 * Wrapped in a motion.div so it can float with parallax on scroll.
 */
export function Floral({
  kind,
  width,
  className,
  style,
  flipX,
  flipY,
  parallax = 0,
  priority = false,
  inline = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useParallax(ref, parallax);
  const src = SRC[kind];
  const transform = `${flipX ? 'scaleX(-1)' : ''} ${flipY ? 'scaleY(-1)' : ''}`.trim();

  return (
    <motion.div
      ref={ref}
      className={`${styles.wrap} ${inline ? styles.inline : ''} ${className ?? ''}`}
      style={{ width, y, ...style }}
      aria-hidden="true"
    >
      <img
        className={styles.img}
        src={src.lg}
        srcSet={`${src.sm} 520w, ${src.lg} ${kind === 'a' ? 960 : 648}w`}
        sizes={width}
        width={kind === 'a' ? 960 : 648}
        height={kind === 'a' ? 951 : 1117}
        alt=""
        decoding="async"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        style={{ transform: transform || undefined, aspectRatio: String(src.ratio) }}
        draggable={false}
      />
    </motion.div>
  );
}
