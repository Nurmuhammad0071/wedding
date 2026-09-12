import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { useCallback, useEffect } from 'react';
import { wedding, type GalleryImage } from '../../config/wedding';
import styles from './Lightbox.module.css';

interface Props {
  images: GalleryImage[];
  index: number | null;
  onClose: () => void;
  onChange: (i: number) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/** Full-screen viewer: swipe on touch, arrows / Esc on keyboard. */
export function Lightbox({ images, index, onClose, onChange }: Props) {
  const reduced = useReducedMotion();
  const open = index !== null;
  const count = images.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onChange((index + dir + count) % count);
    },
    [index, count, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, go, onClose]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const swipe = info.offset.x + info.velocity.x * 0.2;
    if (swipe < -80) go(1);
    else if (swipe > 80) go(-1);
    else if (Math.abs(info.offset.y) > 120) onClose();
  };

  const img = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          role="dialog"
          aria-modal="true"
          aria-label={wedding.a11y.viewer}
          onClick={onClose}
        >
          <button type="button" className={styles.close} onClick={onClose} aria-label={wedding.a11y.close}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>

          <div className={styles.stage} onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={img.src}
                className={styles.figure}
                initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.98 }}
                transition={{ duration: 0.4, ease: EASE }}
                drag={reduced ? false : true}
                dragElastic={0.18}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragSnapToOrigin
                onDragEnd={onDragEnd}
              >
                <img src={img.src} alt={img.alt} draggable={false} />
                <figcaption className={styles.caption}>
                  <span className="small-caps">
                    {index! + 1} / {count}
                  </span>
                  <span className={styles.alt}>{img.alt}</span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                className={`${styles.nav} ${styles.prev}`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(-1);
                }}
                aria-label={wedding.a11y.prev}
              >
                <Chevron />
              </button>
              <button
                type="button"
                className={`${styles.nav} ${styles.next}`}
                onClick={(e) => {
                  e.stopPropagation();
                  go(1);
                }}
                aria-label={wedding.a11y.next}
              >
                <Chevron />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}
