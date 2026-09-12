import type { CSSProperties, ReactNode } from 'react';
import { Flourish } from '../decor/Flourish';
import styles from './Card.module.css';

type Corner = 'tl' | 'tr' | 'bl' | 'br';

interface Props {
  children: ReactNode;
  /** Which corners get the embossed baroque ornament */
  flourishes?: Corner[];
  className?: string;
  style?: CSSProperties;
  id?: string;
  /** Extra decorative layer rendered behind the content (florals etc.) */
  decor?: ReactNode;
}

/**
 * One panel of the stationery suite: cream paper, embossed double frame,
 * optional corner ornaments. Everything else is layered inside.
 */
export function Card({ children, flourishes = [], className, style, id, decor }: Props) {
  return (
    <section id={id} className={`${styles.card} ${className ?? ''}`} style={style}>
      <div className={styles.frame} aria-hidden="true" />
      {flourishes.map((c) => (
        <Flourish key={c} corner={c} className={`${styles.flourish} ${styles[c]}`} size="var(--flourish)" />
      ))}
      {decor}
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
