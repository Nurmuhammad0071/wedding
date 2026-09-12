import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'solid' | 'outline' | 'ghost';

type Common = { variant?: Variant; children: ReactNode; className?: string; icon?: ReactNode };
type AsButton = Common & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type AsLink = Common & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export function Button(props: AsButton | AsLink) {
  const { variant = 'solid', children, className, icon, ...rest } = props;
  const cls = `${styles.btn} ${styles[variant]} ${className ?? ''}`;

  if ('href' in rest && rest.href) {
    const { href, ...a } = rest as AsLink;
    return (
      <a href={href} className={cls} {...a}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span>{children}</span>
      </a>
    );
  }
  return (
    <button className={cls} {...(rest as AsButton)}>
      {icon && <span className={styles.icon}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
