import { motion, useReducedMotion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Reveal } from '../motion/Reveal';
import styles from './Invitation.module.css';

const EASE = [0.22, 1, 0.36, 1] as const;

/** The formal invitation wording — revealed word by word, like ink settling. */
export function Invitation() {
  const reduced = useReducedMotion();
  const words = wedding.text.invitation.split(' ');

  return (
    <Section id="invitation">
      <div className={styles.wrap}>
        <Reveal variant="fadeDown" duration={0.8}>
          <p className="eyebrow eyebrow--muted center">{wedding.text.invitationEyebrow}</p>
        </Reveal>

        <motion.p
          className={styles.text}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0 : 0.028 } } }}
          aria-label={wedding.text.invitation}
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              className={styles.word}
              aria-hidden="true"
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 8 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
              }}
            >
              {w}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </motion.p>

        <Reveal variant="fadeUp" delay={0.2}>
          <p className={`script ${styles.sign}`}>
            {wedding.groom.first} &amp; {wedding.bride.first}
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
