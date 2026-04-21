import { HTTPError, NetworkError, TimeoutError } from './errors.js';

function joinUrl(baseUrl, path) {
  const b = String(baseUrl ?? '').replace(/\/+$/, '');
  const p = String(path ?? '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

async function safeParseJson(res) {
  const text = await res.text().catch(() => '');
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

/**
 * @typedef {Object} RequestOptions
 * @property {string} path
 * @property {string} [method]
 * @property {Record<string,string>} [headers]
 * @property {any} [json]
 * @property {FormData} [formData]
 * @property {AbortSignal} [signal]
 * @property {number} [timeoutMs]
 */

export function createHttpClient({
  baseUrl,
  getToken,
  userAgent,
  fetchImpl = globalThis.fetch,
} = {}) {
  if (!fetchImpl) throw new Error('fetch is not available');

  return {
    /**
     * @param {RequestOptions} opts
     */
    async request(opts) {
      const url = joinUrl(baseUrl, opts.path);
      const method = (opts.method ?? (opts.json || opts.formData ? 'POST' : 'GET')).toUpperCase();

      const headers = new Headers(opts.headers ?? {});
      headers.set('accept', 'application/json');
      if (userAgent) headers.set('user-agent', userAgent);

      const token = getToken?.();
      if (token) headers.set('authorization', `Bearer ${token}`);

      let body = undefined;
      if (opts.json !== undefined) {
        headers.set('content-type', 'application/json');
        body = JSON.stringify(opts.json);
      } else if (opts.formData) {
        body = opts.formData;
      }

      const ctrl = new AbortController();
      const timeoutMs = opts.timeoutMs ?? 12000;
      const t = setTimeout(() => ctrl.abort(), timeoutMs);

      // Merge signals
      const signal = opts.signal;
      if (signal) {
        if (signal.aborted) ctrl.abort();
        else signal.addEventListener('abort', () => ctrl.abort(), { once: true });
      }

      let res;
      try {
        res = await fetchImpl(url, {
          method,
          headers,
          body,
          signal: ctrl.signal,
        });
      } catch (err) {
        if (ctrl.signal.aborted) throw new TimeoutError('Request timed out', { cause: err });
        throw new NetworkError('Failed to reach server', { cause: err });
      } finally {
        clearTimeout(t);
      }

      const requestId = res.headers.get('x-vercel-id') ?? res.headers.get('x-request-id') ?? null;

      if (!res.ok) {
        const bodyParsed = await safeParseJson(res);
        throw new HTTPError(bodyParsed?.message ?? `HTTP ${res.status}`, {
          status: res.status,
          requestId,
          body: bodyParsed,
        });
      }

      // 204 / empty
      if (res.status === 204) return { data: null, requestId };

      const data = await safeParseJson(res);
      return { data, requestId };
    },
  };
}

