'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function SearchInput({ value, onChange, onClear, className, placeholder = 'Search…', ...props }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === '/' && !event.defaultPrevented) {
        const active = document.activeElement as HTMLElement | null;
        if (active && ['INPUT', 'TEXTAREA'].includes(active.tagName)) {
          return;
        }
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, []);

  const handleClear = () => {
    onChange('');
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative flex items-center', className)}>
      <input
        ref={inputRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 pr-12 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70"
        {...props}
      />
      <span className="pointer-events-none absolute right-3 text-xs uppercase tracking-wide text-slate-500">/</span>
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-8 h-7 w-7 rounded-full px-0 text-xs"
          aria-label="Clear search"
          onClick={handleClear}
        >
          ×
        </Button>
      ) : null}
    </div>
  );
}
