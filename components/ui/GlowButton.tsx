'use client';

import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/utils';

interface GlowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function GlowButton({ className, disabled, children, asChild = false, type, ...props }: GlowButtonProps) {
  const classes = cn(
    'relative inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold text-white transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/80',
    'bg-gradient-to-r from-brand-accent/20 via-brand-accent2/20 to-brand-accent/20 shadow-[0_0_25px_rgba(125,211,252,0.25)] hover:shadow-brand-glow',
    'before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-[radial-gradient(circle_at_center,rgba(125,211,252,0.35),transparent)] before:opacity-0 before:transition-opacity hover:before:opacity-100',
    disabled && 'cursor-not-allowed opacity-60',
    className
  );

  if (asChild && isValidElement(children)) {
    const child = children as React.ReactElement<{ className?: string }>;
    return cloneElement(child, {
      ...(props as Record<string, unknown>),
      className: cn(classes, child.props.className),
      'aria-disabled': disabled || undefined
    } as Record<string, unknown>);
  }

  return (
    <button type={type ?? 'button'} {...props} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
