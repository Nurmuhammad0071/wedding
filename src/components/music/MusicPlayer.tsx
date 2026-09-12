import { AnimatePresence, motion } from 'framer-motion';
import { useMusic } from './MusicContext';
import { wedding } from '../../config/wedding';
import styles from './MusicPlayer.module.css';

interface Props {
  visible: boolean;
}

/** Small floating music control — never autoplays by itself. */
export function MusicPlayer({ visible }: Props) {
  const { playing, available, toggle } = useMusic();
  if (!available) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          className={`${styles.btn} ${playing ? styles.playing : ''}`}
          onClick={toggle}
          aria-label={playing ? wedding.a11y.pauseMusic : wedding.a11y.playMusic}
          aria-pressed={playing}
          title={wedding.music.title}
          initial={{ opacity: 0, y: 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.9 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
          whileTap={{ scale: 0.94 }}
        >
          <span className={styles.ring} aria-hidden="true" />
          {playing ? (
            <span className={styles.bars} aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.note} aria-hidden="true">
              <path
                d="M9 18.5V6.2l9-2.2v11.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6.5" cy="18.5" r="2.5" fill="currentColor" />
              <circle cx="15.5" cy="15.5" r="2.5" fill="currentColor" />
            </svg>
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
