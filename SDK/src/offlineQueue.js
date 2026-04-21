const KEY = 'subrev:sdk:offlineQueue:v1';

function readQueue() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeQueue(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('subrev:sdk:offlineQueue:change'));
}

export function getQueuedCount() {
  return readQueue().length;
}

export function enqueueRequest({ url, init }) {
  const method = (init?.method ?? 'GET').toUpperCase();
  if (method === 'GET') return;

  const item = {
    id: crypto.randomUUID(),
    ts: Date.now(),
    url,
    init: {
      ...init,
      signal: undefined,
    },
  };

  const q = readQueue();
  q.push(item);
  writeQueue(q);
}

export async function flushQueue({ max = 30 } = {}) {
  const q = readQueue();
  if (q.length === 0) return { ok: true, flushed: 0, remaining: 0 };

  let flushed = 0;
  const remaining = [];

  for (const item of q.slice(0, max)) {
    try {
      const res = await fetch(item.url, item.init);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      flushed += 1;
    } catch {
      remaining.push(item);
    }
  }

  const tail = q.slice(max);
  writeQueue([...remaining, ...tail]);
  return { ok: remaining.length === 0, flushed, remaining: remaining.length + tail.length };
}

export async function queuedFetch(url, init = {}, { queueIfOffline = true } = {}) {
  const method = (init?.method ?? 'GET').toUpperCase();
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  if (!isOnline && queueIfOffline && method !== 'GET') {
    enqueueRequest({ url, init });
    return new Response(null, { status: 202, statusText: 'Queued (offline)' });
  }

  return fetch(url, init);
}

