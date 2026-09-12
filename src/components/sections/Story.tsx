import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import { wedding, type StoryItem } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Reveal } from '../motion/Reveal';
import styles from './Story.module.css';

export function Story() {
  return (
    <Section id="story" eyebrow={wedding.text.storyEyebrow} title={wedding.text.storyTitle}>
      <div className={styles.list}>
        {wedding.story.map((item, i) => (
          <Chapter key={item.title} item={item} flip={i % 2 === 1} index={i} />
        ))}
      </div>
    </Section>
  );
}

function Chapter({ item, flip, index }: { item: StoryItem; flip: boolean; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // subtle parallax inside the frame: the photo drifts slower than the page
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['-6%', '6%']);
  const rotate = flip ? 1.2 : -1.2;

  return (
    <article ref={ref} className={`${styles.chapter} ${flip ? styles.flip : ''}`}>
      <Reveal variant="clipUp" duration={1.2} amount={0.35} className={styles.photoCol}>
        <div className={styles.print} style={{ transform: `rotate(${rotate}deg)` }}>
          <div className={styles.photo}>
            <motion.img
              src={item.image}
              alt={item.alt}
              loading="lazy"
              decoding="async"
              style={{ y }}
            />
          </div>
          <span className={`script ${styles.printDate}`}>{item.date}</span>
        </div>
      </Reveal>

      <Reveal variant={flip ? 'slideRight' : 'slideLeft'} delay={0.15} duration={1} amount={0.35} className={styles.textCol}>
        <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.text}>{item.text}</p>
      </Reveal>
    </article>
  );
}
