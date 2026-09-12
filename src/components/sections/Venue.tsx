import { wedding } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Reveal, Stagger, Item } from '../motion/Reveal';
import styles from './Venue.module.css';

/** Location as a letterpress plate — no map, just the place itself. */
export function Venue() {
  const { venue } = wedding;

  return (
    <Section id="venue" eyebrow={wedding.text.whereEyebrow} title={wedding.text.venueTitle}>
      <Reveal variant="scaleIn" duration={1.1} amount={0.45}>
        <div className={styles.plate}>
          <span className={styles.plateLine} />
          <span className={styles.pin} aria-hidden="true">
            <PinIcon />
          </span>
          <h3 className={`script ${styles.name}`}>{venue.name}</h3>
          <Stagger className={styles.meta} stagger={0.1} amount={0.6}>
            <Item variant="fadeUp" as="p" className={`eyebrow ${styles.line}`}>
              {venue.city}
            </Item>
            <Item variant="fadeUp" as="p" className={styles.region}>
              {venue.region}
            </Item>
          </Stagger>
          <span className={styles.plateLine} />
        </div>
      </Reveal>
    </Section>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
      <path
        d="M12 21s6.2-5.4 6.2-10.4A6.2 6.2 0 0 0 5.8 10.6C5.8 15.6 12 21 12 21z"
        fill="var(--blush-deep)"
        stroke="rgba(255,255,255,.7)"
        strokeWidth="1"
      />
      <circle cx="12" cy="10.4" r="2.2" fill="#fff" />
    </svg>
  );
}
