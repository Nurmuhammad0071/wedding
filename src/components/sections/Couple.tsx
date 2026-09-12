import { wedding } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Reveal, Stagger, Item } from '../motion/Reveal';
import { AndSwash } from '../decor/AndSwash';
import styles from './Couple.module.css';

export function Couple() {
  const { bride, groom, couple } = wedding;
  return (
    <Section id="couple" eyebrow={wedding.text.coupleEyebrow}>
      <Reveal variant="fadeIn" duration={1.1}>
        <p className={`lead center ${styles.intro}`}>{wedding.text.coupleIntro}</p>
      </Reveal>

      <div className={styles.grid}>
        <Person image={couple.groomImage} first={groom.first} last={groom.last} note={couple.groomNote} side="left" />
        <div className={styles.and}>
          <AndSwash word={wedding.text.and} />
        </div>
        <Person image={couple.brideImage} first={bride.first} last={bride.last} note={couple.brideNote} side="right" />
      </div>
    </Section>
  );
}

interface PersonProps {
  image: string;
  first: string;
  last: string;
  note: string;
  side: 'left' | 'right';
}

function Person({ image, first, last, note, side }: PersonProps) {
  return (
    <Stagger className={`${styles.person} ${styles[side]}`} stagger={0.14} amount={0.35}>
      <Item variant="scaleIn" duration={1.1} className={styles.photoWrap}>
        <div className={styles.photo}>
          <img src={image} alt={`${first} ${last}`} loading="lazy" decoding="async" width={720} height={900} />
        </div>
      </Item>
      <Item variant="fadeUp" as="h3" className={`script ${styles.name}`}>
        {first}
      </Item>
      {last ? (
        <Item variant="fadeUp" as="p" className={`eyebrow ${styles.last}`}>
          {last}
        </Item>
      ) : null}
      {note ? (
        <Item variant="fadeIn" as="p" className={styles.note}>
          {note}
        </Item>
      ) : null}
    </Stagger>
  );
}
