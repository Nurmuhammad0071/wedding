import { wedding } from '../../config/wedding';
import { Card } from '../layout/Card';
import { Floral } from '../decor/Floral';
import { Reveal, Stagger, Item } from '../motion/Reveal';
import { AndSwash } from '../decor/AndSwash';
import styles from './Final.module.css';

/** The closing card — echoes the front, softer and shorter. */
export function Final() {
  return (
    <Card
      className={styles.card}
      flourishes={['tl', 'br']}
      decor={
        <>
          <Floral kind="b" width="clamp(96px, 26vw, 200px)" flipX flipY style={{ top: '-1%', left: '-1%' }} parallax={16} />
          <Floral kind="a" width="clamp(140px, 42vw, 300px)" flipX flipY style={{ bottom: '-3%', right: '-2%' }} parallax={-14} />
        </>
      }
    >
      <div className={styles.content}>
        <Reveal variant="fadeDown">
          <p className="eyebrow eyebrow--muted">{wedding.text.finalEyebrow}</p>
        </Reveal>

        <Reveal variant="blur" delay={0.1}>
          <h2 className={`script ${styles.title}`}>{wedding.text.finalTitle}</h2>
        </Reveal>

        <Stagger className={styles.names} stagger={0.2} amount={0.6}>
          <Item variant="clipRight" duration={1.2} as="span" className={`script ${styles.name}`}>
            {wedding.groom.first}
          </Item>
          <Item variant="fadeIn" className={styles.and}>
            <AndSwash word={wedding.text.and} />
          </Item>
          <Item variant="clipRight" duration={1.2} as="span" className={`script ${styles.name}`}>
            {wedding.bride.first}
          </Item>
        </Stagger>

        <Reveal variant="fadeUp" delay={0.2}>
          <p className={`eyebrow ${styles.date}`}>{wedding.dateLabel2}</p>
        </Reveal>

        <Reveal variant="fadeIn" delay={0.35}>
          <p className={styles.hashtag}>{wedding.text.hashtag}</p>
        </Reveal>
      </div>
    </Card>
  );
}
