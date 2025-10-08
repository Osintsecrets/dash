'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultTabId?: string;
  className?: string;
}

export function Tabs({ items, defaultTabId, className }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTabId ?? items[0]?.id);

  return (
    <div className={cn('space-y-4', className)}>
      <div role="tablist" aria-orientation="horizontal" className="flex flex-wrap gap-2">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              role="tab"
              type="button"
              aria-selected={active}
              aria-controls={`${item.id}-panel`}
              id={`${item.id}-tab`}
              onClick={() => setActiveId(item.id)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/70',
                active ? 'bg-brand-accent/30 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <div
            key={item.id}
            role="tabpanel"
            id={`${item.id}-panel`}
            aria-labelledby={`${item.id}-tab`}
            hidden={!active}
            className="space-y-4"
          >
            {active ? item.content : null}
          </div>
        );
      })}
    </div>
  );
}
