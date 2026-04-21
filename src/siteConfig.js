const KEY = 'subrev_site_config';

const DEFAULTS = {
  siteName: 'SubreV',
  schoolName: 'Школа №1409',
  regOpen: true,
  maintenance: false,
  moderation: false,
  maxPostLen: '1000',
};

export function getConfig() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveConfig(patch) {
  const current = getConfig();
  localStorage.setItem(KEY, JSON.stringify({ ...current, ...patch }));
  window.dispatchEvent(new CustomEvent('siteconfig:change'));
}

export function isMaintenance() {
  return getConfig().maintenance === true;
}
