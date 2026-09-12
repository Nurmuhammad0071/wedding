import { motion, useReducedMotion } from 'framer-motion';
import styles from './Divider.module.css';

interface Props {
  className?: string;
}

/** Ornamental divider: thin embossed lines + a small paper sprig. */
export function Divider({ className }: Props) {
  const reduced = useReducedMotion();
  return (
    <div className={`${styles.root} ${className ?? ''}`} aria-hidden="true">
      <motion.span
        className={styles.line}
        initial={{ scaleX: reduced ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'right center' }}
      />
      <motion.svg
        viewBox="0 0 64 32"
        className={styles.sprig}
        initial={{ opacity: reduced ? 1 : 0, scale: reduced ? 1 : 0.7 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <path
          d="M8 22c8-6 14-8 22-8m2 0c8 0 14 2 22 8"
          fill="none"
          stroke="var(--green)"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path d="M14 20c2-6 7-8 12-6-2 5-7 7-12 6z" fill="var(--sage)" />
        <path d="M50 20c-2-6-7-8-12-6 2 5 7 7 12 6z" fill="var(--sage)" />
        <path d="M22 26c-1-5 2-9 7-9-1 5-3 8-7 9z" fill="var(--green)" />
        <path d="M42 26c1-5-2-9-7-9 1 5 3 8 7 9z" fill="var(--green)" />
        <circle cx="32" cy="13" r="4.2" fill="var(--blush)" />
        <circle cx="32" cy="13" r="2.4" fill="var(--blush-deep)" />
        <circle cx="32" cy="13" r="1" fill="var(--gold)" />
      </motion.svg>
      <motion.span
        className={styles.line}
        initial={{ scaleX: reduced ? 1 : 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: 'left center' }}
      />
    </div>
  );
}
