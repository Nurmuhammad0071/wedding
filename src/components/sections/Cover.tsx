import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { wedding } from '../../config/wedding';
import { useMusic } from '../music/MusicContext';
import styles from './Cover.module.css';

interface Props {
  onOpen: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * The envelope: a quiet cover the guest taps to open.
 * Its tap is also the user gesture that lets music start.
 */
export function Cover({ onOpen }: Props) {
  const { start } = useMusic();
  const reduced = useReducedMotion();

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleOpen = () => {
    start();
    onOpen();
  };

  return (
    <motion.div
      className={styles.cover}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.55 } }}
      role="dialog"
      aria-label={wedding.a11y.envelope}
    >
      {/* two paper leaves that part like an envelope */}
      <motion.div
        className={`${styles.leaf} ${styles.leafTop}`}
        exit={{ y: '-100%', transition: { duration: 1.05, ease: EASE } }}
      />
      <motion.div
        className={`${styles.leaf} ${styles.leafBottom}`}
        exit={{ y: '100%', transition: { duration: 1.05, ease: EASE } }}
      />

      <motion.div
        className={styles.content}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.4 } }}
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } } }}
      >
        <motion.p className="eyebrow eyebrow--muted" variants={fade(reduced)}>
          {wedding.cover.greeting}
        </motion.p>

        <motion.div className={styles.monogram} variants={fade(reduced)}>
          <span className="script">{wedding.groom.first[0]}</span>
          <span className={styles.amp}>&amp;</span>
          <span className="script">{wedding.bride.first[0]}</span>
        </motion.div>

        <motion.p className={`eyebrow ${styles.date}`} variants={fade(reduced)}>
          {wedding.dateLabel2}
        </motion.p>

        <motion.button
          type="button"
          className={styles.seal}
          onClick={handleOpen}
          variants={fade(reduced)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          aria-label={wedding.cover.openAria}
        >
          <span className={styles.sealInner}>
            <span className={`script ${styles.sealText}`}>
              {wedding.groom.first[0]}
              <span className={styles.sealDot}>·</span>
              {wedding.bride.first[0]}
            </span>
          </span>
        </motion.button>

        <motion.span className={`small-caps ${styles.cta}`} variants={fade(reduced)}>
          {wedding.cover.cta}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

const fade = (reduced: boolean | null) => ({
  hidden: { opacity: 0, y: reduced ? 0 : 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
});
