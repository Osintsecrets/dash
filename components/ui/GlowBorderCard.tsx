'use client';

import { KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';
import styles from './GlowBorderCard.module.css';

export interface GlowBorderCardProps {
  heading?: string;
  lines?: string[];
  onClick?: () => void;
  className?: string;
}

export function GlowBorderCard({
  heading = 'Popular this month',
  lines = ['Powered by', 'Uiverse'],
  onClick,
  className
}: GlowBorderCardProps) {
  const isInteractive = typeof onClick === 'function';

  const safeLines = Array.isArray(lines) ? [...lines] : [];
  const accentLine = safeLines.length > 0 ? safeLines[safeLines.length - 1] : undefined;
  const bodyLines = accentLine ? safeLines.slice(0, -1) : safeLines;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  return (
    <div
      className={cn(styles.card, className)}
      onClick={onClick}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onKeyDown={handleKeyDown}
      aria-label={heading}
    >
      {heading ? <p className={styles.heading}>{heading}</p> : null}
      {bodyLines.map((text, index) => (
        <p key={index}>{text}</p>
      ))}
      {accentLine ? <p className={styles.accent}>{accentLine}</p> : null}
    </div>
  );
}
