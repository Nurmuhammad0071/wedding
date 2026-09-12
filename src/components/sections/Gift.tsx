import { useState } from 'react';
import { wedding } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Reveal } from '../motion/Reveal';
import styles from './Gift.module.css';

function grouped(n: string) {
  return n.replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim();
}

/** Playful, optional to‘yona card — tap to copy, never pushy. */
export function Gift() {
  const { gift } = wedding;
  const [copied, setCopied] = useState(false);
  const digits = gift.number.replace(/\s+/g, '');

  async function copy() {
    try {
      await navigator.clipboard.writeText(digits);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = digits;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  }

  return (
    <Section id="gift" eyebrow={gift.eyebrow} title={gift.title}>
      <Reveal variant="fadeIn">
        <p className={`lead center ${styles.lead}`}>{gift.lead}</p>
      </Reveal>

      <Reveal variant="scaleIn" duration={1} amount={0.4}>
        <button type="button" className={styles.card} onClick={copy} aria-label={`${gift.copy}: ${grouped(gift.number)}`}>
          <span className={styles.seal} aria-hidden="true">
            {wedding.groom.first[0]}
            <i>·</i>
            {wedding.bride.first[0]}
          </span>
          <span className={`small-caps ${styles.bank}`}>{gift.bank}</span>
          <span className={styles.number}>{grouped(gift.number)}</span>
          <span className={`small-caps ${styles.cta}`}>{copied ? gift.copied : gift.copy}</span>
        </button>
      </Reveal>

      <Reveal variant="fadeUp" delay={0.15}>
        <p className={`script ${styles.wink}`}>{gift.wink}</p>
      </Reveal>
    </Section>
  );
}
