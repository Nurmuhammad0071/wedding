import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { wedding } from '../../config/wedding';
import { Card } from '../layout/Card';
import { Floral } from '../decor/Floral';
import { AndSwash } from '../decor/AndSwash';
import styles from './Hero.module.css';

interface Props {
  /** true once the cover has been opened → runs the entrance sequence */
  active: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ active }: Props) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // The whole card gently recedes as you scroll away — cinematic, transform-only.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, reduced ? 0 : 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, reduced ? 1 : 0.15]);

  const state = active ? 'visible' : 'hidden';
  const t = (delay: number, duration = 1) => ({ duration: reduced ? 0.5 : duration, delay: reduced ? 0 : delay, ease: EASE });

  const fadeUp = { hidden: { opacity: 0, y: reduced ? 0 : 18 }, visible: { opacity: 1, y: 0 } };
  const write = reduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { clipPath: 'inset(-20% 100% -20% -5%)', opacity: 1 },
        visible: { clipPath: 'inset(-20% -5% -20% -5%)', opacity: 1 },
      };

  return (
    <div ref={ref} className={styles.wrap}>
      <Card
        className={styles.card}
        flourishes={['tr', 'bl']}
        decor={
          <>
            <motion.div
              className={styles.floralTL}
              initial={{ opacity: 0, x: -30, y: -30, scale: 0.94 }}
              animate={active ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
              transition={t(0.15, 1.6)}
            >
              <Floral kind="a" width="100%" parallax={reduced ? 0 : 18} priority inline />
            </motion.div>
            <motion.div
              className={styles.floralBR}
              initial={{ opacity: 0, x: 30, y: 30, scale: 0.94 }}
              animate={active ? { opacity: 1, x: 0, y: 0, scale: 1 } : {}}
              transition={t(0.35, 1.6)}
            >
              <Floral kind="b" width="100%" parallax={reduced ? 0 : -24} priority inline />
            </motion.div>
          </>
        }
      >
        <motion.div className={styles.content} style={{ y: contentY, opacity: contentOpacity }}>
          <motion.p className={`eyebrow ${styles.eyebrow}`} initial="hidden" animate={state}>
            {wedding.text.eyebrow.map((line, i) => (
              <motion.span key={line} className={styles.line} variants={fadeUp} transition={t(0.55 + i * 0.13, 0.9)}>
                {line}
              </motion.span>
            ))}
          </motion.p>

          <h1 className={styles.names}>
            <motion.span
              className={`script ${styles.name}`}
              variants={write}
              initial="hidden"
              animate={state}
              transition={t(1.05, 1.3)}
            >
              {[wedding.groom.first, wedding.groom.last].filter(Boolean).join(' ')}
            </motion.span>

            <span className={styles.and}>
              {active && <AndSwash onMount delay={reduced ? 0 : 1.7} word={wedding.text.and} />}
            </span>

            <motion.span
              className={`script ${styles.name}`}
              variants={write}
              initial="hidden"
              animate={state}
              transition={t(2.05, 1.3)}
            >
              {[wedding.bride.first, wedding.bride.last].filter(Boolean).join(' ')}
            </motion.span>
          </h1>

          <motion.div
            className={styles.details}
            initial="hidden"
            animate={state}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.11, delayChildren: reduced ? 0 : 2.7 } } }}
          >
            <motion.span className="eyebrow" variants={fadeUp} transition={t(0, 0.9)}>
              {wedding.dateLabel}
            </motion.span>
            <motion.span className="eyebrow" variants={fadeUp} transition={t(0, 0.9)}>
              {wedding.dateLabel2}
            </motion.span>
            <motion.span className="eyebrow" variants={fadeUp} transition={t(0, 0.9)}>
              {wedding.timeLabel}
            </motion.span>
            <motion.span className="eyebrow" variants={fadeUp} transition={t(0, 0.9)}>
              {wedding.venue.name}
            </motion.span>
            <motion.span className="eyebrow" variants={fadeUp} transition={t(0, 0.9)}>
              {wedding.venue.city}
            </motion.span>
          </motion.div>

          <motion.p
            className={`script ${styles.reception}`}
            variants={fadeUp}
            initial="hidden"
            animate={state}
            transition={t(3.4, 1)}
          >
            {wedding.text.reception}
          </motion.p>
        </motion.div>

        <motion.a
          href="#details"
          className={styles.scroll}
          aria-label={wedding.a11y.scroll}
          initial={{ opacity: 0 }}
          animate={active ? { opacity: 1 } : {}}
          transition={t(3.9, 1)}
        >
          <span className={styles.scrollLine} />
          <span className={styles.scrollText}>{wedding.text.scroll}</span>
        </motion.a>
      </Card>
    </div>
  );
}
