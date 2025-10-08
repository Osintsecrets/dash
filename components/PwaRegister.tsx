'use client';

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

export function PwaRegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');
      wb.register();
    }
  }, []);

  return null;
}
