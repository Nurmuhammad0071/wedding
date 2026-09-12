import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { wedding } from '../../config/wedding';
import { useCountdown } from '../../hooks/useCountdown';
import { downloadICS } from '../../utils/calendar';
import { Section } from '../layout/Section';
import { Reveal, Stagger, Item } from '../motion/Reveal';
import { Button } from '../ui/Button';
import styles from './Countdown.module.css';

const pad = (n: number) => String(n).padStart(2, '0');

export function Countdown() {
  const c = useCountdown(wedding.dateISO);
  // Read the calendar date straight from the ISO string so the venue's
  // local date is shown regardless of the guest's timezone.
  const [year, month, day] = wedding.dateISO.slice(0, 10).split('-');

  return (
    <Section id="date" eyebrow={wedding.text.whenEyebrow} title={wedding.text.countdownTitle}>
      {/* the date, set like a letterpress plate */}
      <Reveal variant="scaleIn" duration={1.1} amount={0.5}>
        <div className={styles.plate}>
          <span className={styles.plateLine} />
          <div className={styles.dateRow}>
            <span className={styles.dateNum}>{day}</span>
            <span className={styles.dot} />
            <span className={styles.dateNum}>{month}</span>
            <span className={styles.dot} />
            <span className={styles.dateNum}>{year}</span>
          </div>
          <span className={styles.plateLine} />
          <p className={`eyebrow ${styles.weekday}`}>
            {wedding.dateLabel} {wedding.timeLabel}
          </p>
        </div>
      </Reveal>

      {c.done ? (
        <Reveal variant="blur" className={styles.today}>
          <p className={`script ${styles.todayText}`}>{wedding.text.countdownDone}</p>
        </Reveal>
      ) : (
        <Stagger className={styles.units} stagger={0.1} amount={0.5}>
          <Unit value={c.days} label={wedding.text.days} />
          <Unit value={c.hours} label={wedding.text.hours} />
          <Unit value={c.minutes} label={wedding.text.minutes} />
          <Unit value={c.seconds} label={wedding.text.seconds} />
        </Stagger>
      )}

      <Reveal variant="fadeUp" delay={0.3} className={styles.actions}>
        <Button variant="outline" onClick={downloadICS} icon={<CalendarIcon />}>
          {wedding.text.addToCalendar}
        </Button>
      </Reveal>
    </Section>
  );
}

function Unit({ value, label }: { value: number; label: string }) {
  const reduced = useReducedMotion();
  const text = pad(value);
  return (
    <Item variant="fadeDown" className={styles.unit}>
      <div className={styles.value} aria-live="off">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            className={styles.digits}
            initial={{ y: reduced ? 0 : '0.5em', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: reduced ? 0 : '-0.5em', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className={`small-caps ${styles.label}`}>{label}</span>
    </Item>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M8.5 14h2M13.5 14h2M8.5 17h2M13.5 17h2" />
    </svg>
  );
}
