'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface TogglePillProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export function TogglePill({ label = 'Toggle', checked, onChange, className }: TogglePillProps) {
  const [internal, setInternal] = useState(checked ?? false);
  const isControlled = typeof checked === 'boolean';
  const isOn = isControlled ? checked : internal;

  const toggle = () => {
    const next = !isOn;
    if (!isControlled) {
      setInternal(next);
    }
    onChange?.(next);
  };

  return (
    <button
      type="button"
      aria-pressed={isOn}
      className={cn(
        'relative flex h-9 w-20 items-center rounded-full border border-white/10 bg-white/5 p-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70',
        isOn ? 'bg-brand-accent/20' : 'bg-white/5',
        className
      )}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          'inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-brand-card shadow-brand-sm transition-transform duration-200',
          isOn ? 'translate-x-11' : 'translate-x-0'
        )}
      >
        {isOn ? 'On' : 'Off'}
      </span>
    </button>
  );
}
