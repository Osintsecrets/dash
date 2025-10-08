'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button, Card } from '@/components/ui';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

interface Toast extends ToastOptions {
  id: number;
}

interface ToastContextValue {
  push: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const push = useCallback((options: ToastOptions) => {
    setToasts((current) => {
      const id = Date.now() + Math.random();
      const toast: Toast = { id, duration: 4000, ...options };
      window.setTimeout(() => {
        setToasts((list) => list.filter((item) => item.id !== id));
      }, toast.duration);
      return [...current, toast];
    });
  }, []);

  const contextValue = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {mounted
        ? createPortal(
            <div className="pointer-events-none fixed bottom-6 right-6 z-[200] flex w-full max-w-sm flex-col gap-3">
              {toasts.map((toast) => (
                <Card key={toast.id} className="pointer-events-auto border-white/10 bg-brand-surface/95 p-4 shadow-brand-md">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-semibold text-white">{toast.title}</p>
                      {toast.description ? <p className="text-xs text-slate-400">{toast.description}</p> : null}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 rounded-full px-0 text-xs"
                      aria-label="Dismiss notification"
                      onClick={() => setToasts((list) => list.filter((item) => item.id !== toast.id))}
                    >
                      ×
                    </Button>
                  </div>
                </Card>
              ))}
            </div>,
            document.body
          )
        : null}
    </ToastContext.Provider>
  );
}
