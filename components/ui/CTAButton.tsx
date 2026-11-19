import Link from 'next/link';
import clsx from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

type BaseProps = {
  href?: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

/** White-on-black solid button — primary CTA. */
export function PrimaryButton({
  href,
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = clsx('btn-primary', className);
  if (href) {
    return (
      <Link href={href} className={classes} onClick={rest.onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

/** Transparent border button — secondary CTA. */
export function SecondaryButton({
  href,
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = clsx('btn-secondary', className);
  if (href) {
    return (
      <Link href={href} className={classes} onClick={rest.onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}

/** Minimal ghost button — tertiary or icon-adjacent actions. */
export function GhostButton({
  href,
  className,
  children,
  ...rest
}: BaseProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = clsx('btn-ghost', className);
  if (href) {
    return (
      <Link href={href} className={classes} onClick={rest.onClick}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
