const KEY = 'subrev_changelog';

const INITIAL = [
  {
    id: 1,
    version: 'v0.1.0',
    date: '21 апреля 2026',
    badge: 'Запуск',
    items: [
      '🎉 Запуск SubreV — школьной соцсети №1409',
      '📝 Лента постов: создание, лайки, комментарии',
      '🖼️ Прикрепление фото, видео и GIF к постам',
      '👤 Страница профиля и настройки',
      '🔔 Уведомления',
      '🛡️ Панель администратора',
      '🌓 Светлая и тёмная тема',
      '🔧 Режим технического обслуживания',
    ],
  },
];

export function getChangelog() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : INITIAL;
  } catch {
    return INITIAL;
  }
}

export function saveChangelog(releases) {
  localStorage.setItem(KEY, JSON.stringify(releases));
  window.dispatchEvent(new CustomEvent('changelog:change'));
}
