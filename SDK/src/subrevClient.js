import { createHttpClient } from './http.js';
import { createMemoryTokenStorage } from './tokenStorage.js';
import { queuedFetch } from './offlineQueue.js';

/**
 * SubreV SDK client.
 *
 * This SDK is designed so you can:
 * - Authenticate (store token)
 * - Build bots
 * - Create sticker packs and stickers
 * - Extend with your own resources
 *
 * Note: The actual backend endpoints must exist. This SDK defines a clean contract.
 */
export class SubrevClient {
  /**
   * @param {Object} opts
   * @param {string} opts.baseUrl Example: 'https://your-app.vercel.app'
   * @param {{get(): (string|null), set(token: (string|null)): void, clear(): void}} [opts.tokenStorage]
   * @param {boolean} [opts.queueWritesWhenOffline] If true, non-GET requests are queued offline (browser only).
   * @param {typeof fetch} [opts.fetchImpl] Custom fetch (Node/web)
   * @param {string} [opts.userAgent]
   */
  constructor({
    baseUrl,
    tokenStorage = createMemoryTokenStorage(),
    queueWritesWhenOffline = false,
    fetchImpl,
    userAgent,
  } = {}) {
    this.baseUrl = baseUrl;
    this.tokenStorage = tokenStorage;
    this.queueWritesWhenOffline = queueWritesWhenOffline;

    const effectiveFetch =
      queueWritesWhenOffline
        ? (url, init) => queuedFetch(url, init)
        : (fetchImpl ?? globalThis.fetch);

    this.http = createHttpClient({
      baseUrl,
      fetchImpl: effectiveFetch,
      getToken: () => this.tokenStorage.get(),
      userAgent,
    });

    this.auth = {
      getToken: () => this.tokenStorage.get(),
      setToken: (t) => this.tokenStorage.set(t),
      clearToken: () => this.tokenStorage.clear(),

      /**
       * Password-less / code login example contract.
       * Backend should return: { token, user }
       */
      loginWithCode: async ({ login, code }) => {
        const { data } = await this.http.request({
          path: 'api/auth/login',
          method: 'POST',
          json: { login, code },
        });
        if (data?.token) this.tokenStorage.set(data.token);
        return data;
      },

      /**
       * Simple password login example contract.
       */
      loginWithPassword: async ({ login, password }) => {
        const { data } = await this.http.request({
          path: 'api/auth/login',
          method: 'POST',
          json: { login, password },
        });
        if (data?.token) this.tokenStorage.set(data.token);
        return data;
      },

      me: async () => {
        const { data } = await this.http.request({ path: 'api/auth/me', method: 'GET' });
        return data;
      },
    };

    this.stickers = {
      listPacks: async () => {
        const { data } = await this.http.request({ path: 'api/stickers/packs', method: 'GET' });
        return data;
      },

      createPack: async ({ title, description, isPublic = false }) => {
        const { data } = await this.http.request({
          path: 'api/stickers/packs',
          method: 'POST',
          json: { title, description, isPublic },
        });
        return data;
      },

      /**
       * Upload a sticker file into a pack.
       * Backend should accept multipart/form-data: file + emoji/title
       */
      uploadSticker: async ({ packId, file, emoji, title }) => {
        const fd = new FormData();
        fd.append('file', file);
        if (emoji) fd.append('emoji', emoji);
        if (title) fd.append('title', title);
        const { data } = await this.http.request({
          path: `api/stickers/packs/${encodeURIComponent(packId)}/stickers`,
          method: 'POST',
          formData: fd,
        });
        return data;
      },
    };

    this.bots = {
      list: async () => {
        const { data } = await this.http.request({ path: 'api/bots', method: 'GET' });
        return data;
      },

      create: async ({ name, avatarUrl, description, scopes = [] }) => {
        const { data } = await this.http.request({
          path: 'api/bots',
          method: 'POST',
          json: { name, avatarUrl, description, scopes },
        });
        return data;
      },

      rotateToken: async ({ botId }) => {
        const { data } = await this.http.request({
          path: `api/bots/${encodeURIComponent(botId)}/token:rotate`,
          method: 'POST',
        });
        return data;
      },

      /**
       * Example "send message" contract.
       */
      sendMessage: async ({ botId, chatId, text, stickerId }) => {
        const { data } = await this.http.request({
          path: `api/bots/${encodeURIComponent(botId)}/chats/${encodeURIComponent(chatId)}/messages`,
          method: 'POST',
          json: { text, stickerId },
        });
        return data;
      },
    };
  }

  /**
   * Low-level request escape hatch.
   */
  request(opts) {
    return this.http.request(opts);
  }

  /**
   * Extend the client with your own module:
   * client.use('my', (client) => ({ hello: () => ... }))
   */
  use(name, factory) {
    this[name] = factory(this);
    return this;
  }
}

