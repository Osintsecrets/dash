'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}

export function Switch({ checked, onCheckedChange, label = 'Toggle', id, disabled }: SwitchProps) {
  const [internal, setInternal] = useState(checked ?? false);
  const isControlled = typeof checked === 'boolean';
  const isOn = isControlled ? checked : internal;

  function toggle() {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) {
      setInternal(next);
    }
    onCheckedChange?.(next);
  }

  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={isOn}
      aria-label={label}
      disabled={disabled}
      onClick={toggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggle();
        }
      }}
      className={cn(
        'relative inline-flex h-8 w-16 items-center rounded-full border border-white/10 bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70',
        isOn ? 'bg-brand-accent/30' : 'bg-white/10',
        disabled && 'cursor-not-allowed opacity-60'
      )}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={cn(
          'absolute left-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-brand-card shadow-brand-sm transition-transform',
          isOn ? 'translate-x-8' : 'translate-x-0'
        )}
      >
        {isOn ? 'On' : 'Off'}
      </span>
    </button>
  );
}
