const PROFILE_KEY = 'subrev_profile';
const FOLLOWING_KEY = 'subrev_following';

const DEFAULTS = {
  email: '',
  name: '',
  avatar: null,
  initials: '',
  bio: '',
  school: 'Школа №1409',
  joined: '',
};

export function getProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveProfile(patch) {
  const current = getProfile();
  localStorage.setItem(PROFILE_KEY, JSON.stringify({ ...current, ...patch }));
  window.dispatchEvent(new CustomEvent('profile:change'));
}

export function getFollowing() {
  try {
    const raw = localStorage.getItem(FOLLOWING_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFollow(userId) {
  const current = getFollowing();
  const updated = current.includes(userId)
    ? current.filter(id => id !== userId)
    : [...current, userId];
  localStorage.setItem(FOLLOWING_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent('following:change'));
  return !current.includes(userId);
}

export function isFollowing(userId) {
  return getFollowing().includes(userId);
}
