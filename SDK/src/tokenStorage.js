export function createMemoryTokenStorage(initialToken = null) {
  let token = initialToken;
  return {
    get() {
      return token;
    },
    set(nextToken) {
      token = nextToken ?? null;
    },
    clear() {
      token = null;
    },
  };
}

export function createWebTokenStorage(key = 'subrev:sdk:token') {
  return {
    get() {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(token) {
      try {
        if (token == null) localStorage.removeItem(key);
        else localStorage.setItem(key, token);
      } catch {
        // ignore
      }
    },
    clear() {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}

