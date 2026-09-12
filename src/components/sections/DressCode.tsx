import { wedding } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Reveal, Stagger, Item } from '../motion/Reveal';
import styles from './DressCode.module.css';

export function DressCode() {
  return (
    <Section id="dress" eyebrow={wedding.text.dressEyebrow} title={wedding.text.dressTitle}>
      <div className={styles.wrap}>
        <Reveal variant="fadeUp">
          <p className={styles.code}>{wedding.text.dressCode}</p>
        </Reveal>
        <Reveal variant="fadeIn" delay={0.15}>
          <p className={`lead ${styles.note}`}>{wedding.text.dressNote}</p>
        </Reveal>

        <Stagger className={styles.palette} stagger={0.09} amount={0.6} as="ul">
          {wedding.dress.palette.map((c) => (
            <Item key={c.name} as="li" variant="scaleIn" duration={0.8} className={styles.swatch}>
              <span className={styles.chip} style={{ background: c.hex }} aria-hidden="true" />
              <span className={`small-caps ${styles.chipName}`}>{c.name}</span>
            </Item>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
