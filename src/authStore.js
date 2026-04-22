const SESSION_KEY = 'subrev_session';

export function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function isAuthed() {
  const s = getSession();
  return !!(s && s.session && s.email && s.userId);
}

export function saveSession({ session, email, userId }) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ session, email, userId }));
  window.dispatchEvent(new CustomEvent('auth:change'));
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new CustomEvent('auth:change'));
}

