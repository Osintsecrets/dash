const CACHE_NAME = 'sr-cache-v2';
const STORAGE_KEY = 'sr-queue';

export type QStatus = 'idle' | 'queued' | 'downloading' | 'paused' | 'done' | 'error' | 'canceled';

export interface QItem {
  id: string;
  path: string;
  bytes: number;
  sha256: string;
  status: QStatus;
  progress: number;
  startedAt?: number;
  updatedAt?: number;
  error?: string;
}

type QueueState = {
  map: Map<string, QItem>;
  order: string[];
  running: boolean;
  sizeCapBytes: number;
};

const defaultState: QueueState = {
  map: new Map<string, QItem>(),
  order: [],
  running: false,
  sizeCapBytes: 200 * 1024 * 1024,
};

const state: QueueState = defaultState;

function now() {
  return Date.now();
}

function hasWindow(): boolean {
  return typeof window !== 'undefined';
}

function getStorage(): Storage | null {
  if (!hasWindow()) return null;
  try {
    return window.localStorage;
  } catch (error) {
    console.warn('Unable to access localStorage for queue persistence.', error);
    return null;
  }
}

function saveState() {
  const storage = getStorage();
  if (!storage) return;
  const payload = {
    items: Array.from(state.map.values()),
    order: state.order,
    sizeCapBytes: state.sizeCapBytes,
  };
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.warn('Failed to persist queue state.', error);
  }
}

function loadState() {
  const storage = getStorage();
  if (!storage) return;
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as { items?: QItem[]; order?: string[]; sizeCapBytes?: number };
    if (parsed.items) {
      state.map = new Map(parsed.items.map((item) => [item.id, item]));
    }
    if (parsed.order) {
      state.order = parsed.order;
    }
    if (typeof parsed.sizeCapBytes === 'number') {
      state.sizeCapBytes = parsed.sizeCapBytes;
    }
  } catch (error) {
    console.warn('Failed to load queue state.', error);
  }
}

if (hasWindow()) {
  loadState();
}

export function getQueue(): QItem[] {
  return state.order.map((id) => state.map.get(id)).filter((item): item is QItem => Boolean(item));
}

export function getCapBytes(): number {
  return state.sizeCapBytes;
}

export function setCapBytes(value: number) {
  state.sizeCapBytes = value;
  saveState();
}

export function enqueue(items: Array<{ id: string; path: string; bytes: number; sha256: string }>) {
  for (const item of items) {
    if (state.map.has(item.id)) continue;
    const queued: QItem = {
      ...item,
      status: 'queued',
      progress: 0,
      startedAt: now(),
      updatedAt: now(),
    };
    state.map.set(item.id, queued);
    state.order.push(item.id);
  }
  saveState();
}

export function remove(id: string) {
  state.map.delete(id);
  state.order = state.order.filter((entry) => entry !== id);
  saveState();
}

export function pause(id: string) {
  const item = state.map.get(id);
  if (!item) return;
  item.status = 'paused';
  item.updatedAt = now();
  saveState();
}

export function resume(id: string) {
  const item = state.map.get(id);
  if (!item) return;
  if (item.status === 'paused' || item.status === 'error' || item.status === 'canceled') {
    item.status = 'queued';
    item.updatedAt = now();
    item.error = undefined;
  }
  saveState();
  void run();
}

export function cancel(id: string) {
  const item = state.map.get(id);
  if (!item) return;
  item.status = 'canceled';
  item.updatedAt = now();
  saveState();
}

export async function run() {
  if (state.running) return;
  state.running = true;
  try {
    await enforceCap();
    for (const id of state.order) {
      const item = state.map.get(id);
      if (!item) continue;
      if (item.status !== 'queued') continue;
      await processItem(item);
      saveState();
    }
  } finally {
    state.running = false;
  }
}

async function processItem(item: QItem) {
  item.status = 'downloading';
  item.progress = 0;
  item.startedAt = item.startedAt ?? now();
  item.updatedAt = now();
  saveState();

  try {
    const response = await fetch(item.path, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const buffer = await response.arrayBuffer();
    const digest = await sha256Hex(buffer);
    if (item.sha256 && item.sha256 !== 'dev' && digest !== item.sha256) {
      throw new Error('Checksum mismatch');
    }

    const cache = await getCache();
    if (!cache) {
      throw new Error('Cache API unavailable');
    }
    await cache.put(item.path, new Response(buffer, { headers: { 'Content-Type': contentTypeFromPath(item.path) } }));

    item.status = 'done';
    item.progress = 1;
    item.updatedAt = now();
    item.error = undefined;
  } catch (error) {
    item.status = 'error';
    item.error = error instanceof Error ? error.message : String(error);
    item.updatedAt = now();
  }
}

export async function enforceCap() {
  const cache = await getCache();
  if (!cache) return;

  const doneItems = getQueue().filter((item) => item.status === 'done');
  let total = doneItems.reduce((sum, entry) => sum + (entry.bytes ?? 0), 0);

  if (total <= state.sizeCapBytes) {
    return;
  }

  doneItems.sort((a, b) => (a.updatedAt ?? 0) - (b.updatedAt ?? 0));

  while (total > state.sizeCapBytes && doneItems.length > 0) {
    const victim = doneItems.shift();
    if (!victim) break;
    await cache.delete(victim.path);
    victim.status = 'idle';
    victim.progress = 0;
    victim.updatedAt = now();
    victim.error = undefined;
    total = doneItems.reduce((sum, entry) => sum + (entry.bytes ?? 0), 0);
  }

  saveState();
}

export async function isCached(path: string) {
  const cache = await getCache();
  if (!cache) return false;
  const match = await cache.match(path);
  return Boolean(match);
}

export async function clearAllCached() {
  if (!(await hasCache())) return;
  await caches.delete(CACHE_NAME);
  for (const item of state.map.values()) {
    if (item.status === 'done') {
      item.status = 'idle';
      item.progress = 0;
      item.updatedAt = now();
    }
  }
  saveState();
}

async function sha256Hex(buffer: ArrayBuffer) {
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function contentTypeFromPath(path: string) {
  if (path.endsWith('.json')) return 'application/json';
  if (path.endsWith('.mp3')) return 'audio/mpeg';
  if (path.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

async function hasCache() {
  return typeof caches !== 'undefined';
}

async function getCache() {
  if (typeof caches === 'undefined') return null;
  return caches.open(CACHE_NAME);
}
