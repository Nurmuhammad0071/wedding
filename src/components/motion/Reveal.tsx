import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { CSSProperties, ElementType, ReactNode } from 'react';

export type RevealVariant =
  | 'fadeUp'
  | 'fadeDown'
  | 'fadeIn'
  | 'scaleIn'
  | 'slideLeft'
  | 'slideRight'
  | 'clipUp'
  | 'clipRight'
  | 'blur';

export const EASE = [0.22, 1, 0.36, 1] as const;

const VARIANTS: Record<RevealVariant, Variants> = {
  fadeUp: { hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } },
  fadeDown: { hidden: { opacity: 0, y: -22 }, visible: { opacity: 1, y: 0 } },
  fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  scaleIn: { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1 } },
  slideLeft: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
  slideRight: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  // keep units identical on both ends so the clip-path interpolates
  clipUp: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)', y: 12 },
    visible: { clipPath: 'inset(0% 0% 0% 0%)', y: 0 },
  },
  clipRight: {
    hidden: { clipPath: 'inset(-10% 100% -10% -5%)' },
    visible: { clipPath: 'inset(-10% -5% -10% -5%)' },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(8px)', y: 10 },
    visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
  },
};

const REDUCED: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };

interface RevealProps {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  /** Fraction of the element visible before it animates */
  amount?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}

/** Scroll-triggered reveal. Uses transform/opacity only (GPU friendly). */
export function Reveal({
  children,
  variant = 'fadeUp',
  delay = 0,
  duration = 0.9,
  amount = 0.25,
  once = true,
  className,
  style,
  as = 'div',
}: RevealProps) {
  const reduced = useReducedMotion();
  const Comp = (motion as unknown as Record<string, typeof motion.div>)[as as string] ?? motion.div;
  return (
    <Comp
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: '0px 0px -8% 0px' }}
      variants={reduced ? REDUCED : VARIANTS[variant]}
      transition={{ duration: reduced ? 0.4 : duration, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
}

interface StaggerProps {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  amount?: number;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}

/** Container that staggers its <Item> children. */
export function Stagger({
  children,
  stagger = 0.12,
  delay = 0,
  amount = 0.25,
  className,
  style,
  as = 'div',
}: StaggerProps) {
  const Comp = (motion as unknown as Record<string, typeof motion.div>)[as as string] ?? motion.div;
  return (
    <Comp
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount, margin: '0px 0px -8% 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
    >
      {children}
    </Comp>
  );
}

interface ItemProps {
  children: ReactNode;
  variant?: RevealVariant;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  as?: ElementType;
}

export function Item({
  children,
  variant = 'fadeUp',
  duration = 0.9,
  className,
  style,
  as = 'div',
}: ItemProps) {
  const reduced = useReducedMotion();
  const Comp = (motion as unknown as Record<string, typeof motion.div>)[as as string] ?? motion.div;
  return (
    <Comp
      className={className}
      style={style}
      variants={reduced ? REDUCED : VARIANTS[variant]}
      transition={{ duration: reduced ? 0.4 : duration, ease: EASE }}
    >
      {children}
    </Comp>
  );
}
