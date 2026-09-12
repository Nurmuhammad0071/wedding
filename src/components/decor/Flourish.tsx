import type { CSSProperties } from 'react';
import styles from './Flourish.module.css';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

interface Props {
  corner: Corner;
  size?: number | string;
  className?: string;
  style?: CSSProperties;
}

const TRANSFORM: Record<Corner, string> = {
  tl: 'none',
  tr: 'scaleX(-1)',
  bl: 'scaleY(-1)',
  br: 'scale(-1, -1)',
};

/** Embossed baroque corner ornament, drawn in SVG to echo the reference frame. */
export function Flourish({ corner, size = 120, className, style }: Props) {
  return (
    <svg
      viewBox="0 0 140 140"
      width={size}
      height={size}
      className={`${styles.root} ${className ?? ''}`}
      style={{ transform: TRANSFORM[corner], ...style }}
      aria-hidden="true"
      focusable="false"
    >
      <g className={styles.strokes} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {/* edge scrolls */}
        <path d="M6 6C34 4 62 6 84 12c16 4 26 12 22 22-3 8-14 8-16 0-2-6 6-10 9-4" />
        <path d="M6 6C4 34 6 62 12 84c4 16 12 26 22 22 8-3 8-14 0-16-6-2-10 6-4 9" />
        {/* inner acanthus */}
        <path d="M16 16c16 4 30 12 40 26 6 8 4 18-4 20-6 1-10-5-6-10 3-4 8-2 8 2" />
        <path d="M16 16c4 16 12 30 26 40 8 6 18 4 20-4 1-6-5-10-10-6-4 3-2 8 2 8" />
        {/* mid curls */}
        <path d="M62 10c12 8 14 20 6 26-4 3-8-2-4-4" />
        <path d="M10 62c8 12 20 14 26 6 3-4-2-8-4-4" />
        {/* tiny sprigs */}
        <path d="M40 9c6 4 10 12 6 18" />
        <path d="M9 40c4 6 12 10 18 6" />
      </g>
      <g className={styles.fills}>
        <path d="M22 5c8 4 10 14 2 20-6-6-8-14-2-20z" />
        <path d="M5 22c4 8 14 10 20 2-6-6-14-8-20-2z" />
        <path d="M88 30c4 1 5 5 3 8-3-1-5-5-3-8z" />
        <path d="M30 88c1 4 5 5 8 3-1-3-5-5-8-3z" />
        <circle cx="70" cy="22" r="2.4" />
        <circle cx="22" cy="70" r="2.4" />
        <circle cx="52" cy="52" r="2" />
      </g>
    </svg>
  );
}
