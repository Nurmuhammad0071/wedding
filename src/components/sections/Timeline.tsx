import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { wedding, type TimelineItem } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Reveal } from '../motion/Reveal';
import styles from './Timeline.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/** The order of the day — the line draws itself as the guest scrolls. */
export function Timeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 62%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [reduced ? 1 : 0, 1]);

  return (
    <Section id="timeline" eyebrow={wedding.text.scheduleEyebrow} title={wedding.text.timelineTitle}>
      <ol ref={ref} className={styles.list}>
        <span className={styles.track} aria-hidden="true">
          <motion.span className={styles.progress} style={{ scaleY }} />
        </span>
        {wedding.timeline.map((item, i) => (
          <Row key={item.time + item.title} item={item} index={i} />
        ))}
      </ol>
    </Section>
  );
}

function Row({ item, index }: { item: TimelineItem; index: number }) {
  const reduced = useReducedMotion();
  return (
    <li className={styles.row}>
      <motion.span
        className={styles.dot}
        initial={{ scale: reduced ? 1 : 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, amount: 1, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        aria-hidden="true"
      >
        <Icon name={item.icon} />
      </motion.span>

      <Reveal variant={index % 2 ? 'slideLeft' : 'slideRight'} duration={0.9} amount={0.6} className={styles.body}>
        <time className={`small-caps ${styles.time}`}>{item.time}</time>
        <h3 className={styles.title}>{item.title}</h3>
        {item.note && <p className={styles.note}>{item.note}</p>}
      </Reveal>
    </li>
  );
}

function Icon({ name }: { name: TimelineItem['icon'] }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (name) {
    case 'rings':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="9" cy="13" r="5.5" />
          <circle cx="15" cy="13" r="5.5" />
          <path d="M12 5.5 10.5 3h3z" />
        </svg>
      );
    case 'glass':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M8 3h8l-1 7a3 3 0 0 1-6 0z" />
          <path d="M12 13v7M9 20h6" />
        </svg>
      );
    case 'dinner':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <circle cx="12" cy="12" r="6.5" />
          <circle cx="12" cy="12" r="3" />
          <path d="M3 8v8M21 6v10" />
        </svg>
      );
    case 'dance':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M9 18.5V6.2l9-2.2v11.5" />
          <circle cx="6.5" cy="18.5" r="2.5" />
          <circle cx="15.5" cy="15.5" r="2.5" />
        </svg>
      );
    case 'cake':
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="M4 20h16M5 20v-6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6" />
          <path d="M5 15c1.5 1.5 3 1.5 4.5 0s3 1.5 4.5 0 3 1.5 4.5 0" />
          <path d="M12 12V8M12 4v1" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" {...common}>
          <path d="m12 3 2.2 5.2L20 9l-4.4 3.8L17 19l-5-3-5 3 1.4-6.2L4 9l5.8-.8z" />
        </svg>
      );
  }
}
