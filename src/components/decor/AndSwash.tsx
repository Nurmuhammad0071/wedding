import { motion, useReducedMotion } from 'framer-motion';
import styles from './AndSwash.module.css';

interface Props {
  /** delay before the swash draws (seconds) */
  delay?: number;
  /** animate on mount (hero) instead of on scroll */
  onMount?: boolean;
  word?: string;
  className?: string;
}

const draw = (delay: number, reduced: boolean) => ({
  hidden: { pathLength: reduced ? 1 : 0, opacity: reduced ? 1 : 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: {
      pathLength: { duration: 1.4, delay, ease: [0.4, 0, 0.2, 1] },
      opacity: { duration: 0.3, delay },
    },
  },
});

/** The calligraphic “and” with flourishes, like the reference card. */
export function AndSwash({ delay = 0, onMount = false, word = 'va', className }: Props) {
  const reduced = useReducedMotion();
  const variants = draw(delay, !!reduced);
  const viewProps = onMount
    ? { initial: 'hidden', animate: 'visible' }
    : { initial: 'hidden', whileInView: 'visible', viewport: { once: true, amount: 0.6 } };

  return (
    <div className={`${styles.root} ${className ?? ''}`} aria-hidden="true">
      <motion.svg viewBox="0 0 120 40" className={styles.swash} {...viewProps}>
        <motion.path
          d="M118 22c-14 6-30 8-50 4-14-3-24-8-40-6-10 1-20 6-26 14"
          variants={variants}
        />
        <motion.path d="M118 22c-4-4-10-6-14-2" variants={variants} />
      </motion.svg>
      <motion.span
        className={`script ${styles.word}`}
        initial={{ opacity: reduced ? 1 : 0, y: reduced ? 0 : 8 }}
        {...(onMount
          ? { animate: { opacity: 1, y: 0 } }
          : { whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: 0.6 } })}
        transition={{ duration: 0.9, delay: delay + 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        {word}
      </motion.span>
      <motion.svg
        viewBox="0 0 120 40"
        className={`${styles.swash} ${styles.swashRight}`}
        {...viewProps}
      >
        <motion.path
          d="M118 22c-14 6-30 8-50 4-14-3-24-8-40-6-10 1-20 6-26 14"
          variants={variants}
        />
        <motion.path d="M118 22c-4-4-10-6-14-2" variants={variants} />
      </motion.svg>
    </div>
  );
}
