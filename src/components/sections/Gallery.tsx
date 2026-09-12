import { useCallback, useState } from 'react';
import { wedding } from '../../config/wedding';
import { Section } from '../layout/Section';
import { Stagger, Item } from '../motion/Reveal';
import { Lightbox } from '../ui/Lightbox';
import styles from './Gallery.module.css';

export function Gallery() {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const images = wedding.gallery;

  return (
    <Section id="gallery" eyebrow={wedding.text.galleryEyebrow} title={wedding.text.galleryTitle}>
      <Stagger className={styles.grid} stagger={0.09} amount={0.15} as="ul">
        {images.map((img, i) => (
          <Item key={img.src} as="li" variant="scaleIn" duration={1} className={styles.cell}>
            <button
              type="button"
              className={styles.print}
              onClick={() => setOpen(i)}
              aria-label={wedding.a11y.photo(img.alt)}
              style={{ aspectRatio: String(img.ratio ?? 1) }}
            >
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            </button>
          </Item>
        ))}
      </Stagger>
      <p className={`small-caps ${styles.hint}`} aria-hidden="true">
        {wedding.text.galleryHint}
      </p>

      <Lightbox images={images} index={open} onClose={close} onChange={setOpen} />
    </Section>
  );
}
