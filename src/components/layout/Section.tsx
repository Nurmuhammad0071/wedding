import type { ReactNode } from 'react';
import { Reveal } from '../motion/Reveal';
import styles from './Section.module.css';

interface Props {
  id?: string;
  children: ReactNode;
  className?: string;
  /** small uppercase label above the title */
  eyebrow?: string;
  /** script title */
  title?: string;
  /** align header */
  align?: 'center' | 'left';
}

export function Section({ id, children, className, eyebrow, title, align = 'center' }: Props) {
  return (
    <div id={id} className={`${styles.section} ${className ?? ''}`}>
      {(eyebrow || title) && (
        <header className={`${styles.header} ${align === 'left' ? styles.left : ''}`}>
          {eyebrow && (
            <Reveal variant="fadeDown" duration={0.8}>
              <p className="eyebrow eyebrow--muted">{eyebrow}</p>
            </Reveal>
          )}
          {title && (
            <Reveal variant="blur" delay={0.1}>
              <h2 className={`script ${styles.title}`}>{title}</h2>
            </Reveal>
          )}
        </header>
      )}
      {children}
    </div>
  );
}
