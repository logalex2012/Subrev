import {
  Button,
  Card,
  CardContent,
  Separator,
  Surface,
  Switch,
  SwitchContent,
  SwitchControl,
  SwitchThumb,
  Text,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { MobileMenuButton } from '../MobileMenu.jsx';
import { getProfile, saveProfile } from '../userStore.js';

function BackHeader({ title }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur-md sm:px-8">
      <Button isIconOnly variant="ghost" size="sm" onPress={() => navigate('/feed')} aria-label="Назад">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </Button>
      <span className="font-display font-bold tracking-tight text-foreground">{title}</span>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <MobileMenuButton className="sm:hidden" />
      </div>
    </header>
  );
}

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description && <Text size="xs" variant="muted" className="mt-0.5">{description}</Text>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <Text size="xs" className="mb-2 mt-6 block px-1 font-semibold uppercase tracking-wider text-muted">
      {children}
    </Text>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [notifLikes, setNotifLikes] = useState(true);
  const [notifComments, setNotifComments] = useState(true);
  const [notifFollows, setNotifFollows] = useState(true);
  const [soundOn, setSoundOn] = useState(false);

  // Sessions
  const [sessions, setSessions] = useState([
    { id: 1, device: 'MacBook Pro 14"', os: 'macOS 15', browser: 'Chrome 124', location: 'Москва, Россия', lastActive: 'Сейчас', current: true, icon: '💻' },
    { id: 2, device: 'iPhone 16', os: 'iOS 18', browser: 'Safari', location: 'Москва, Россия', lastActive: '2 ч назад', current: false, icon: '📱' },
    { id: 3, device: 'Windows PC', os: 'Windows 11', browser: 'Firefox 125', location: 'Москва, Россия', lastActive: 'Вчера, 18:30', current: false, icon: '🖥️' },
  ]);

  function terminateSession(id) {
    setSessions(prev => prev.filter(s => s.id === id ? s.current : true));
  }

  function terminateAll() {
    setSessions(prev => prev.filter(s => s.current));
  }

  // Password change
  const [pwSection, setPwSection] = useState(false);
  const [oldPw, setOldPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [newPw2, setNewPw2] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSaved, setPwSaved] = useState(false);

  function savePassword() {
    setPwError('');
    if (!oldPw) { setPwError('Введите текущий пароль'); return; }
    if (newPw.length < 6) { setPwError('Минимум 6 символов'); return; }
    if (newPw !== newPw2) { setPwError('Пароли не совпадают'); return; }
    saveProfile({ password: newPw });
    setPwSaved(true);
    setOldPw(''); setNewPw(''); setNewPw2('');
    setTimeout(() => { setPwSaved(false); setPwSection(false); }, 2000);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <BackHeader title="Настройки" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        {/* Appearance */}
        <SectionTitle>Внешний вид</SectionTitle>
        <Card variant="default">
          <CardContent className="divide-y divide-border px-4 py-0">
            <SettingRow label="Тема" description="Переключить между светлой и тёмной">
              <ThemeToggle />
            </SettingRow>
          </CardContent>
        </Card>

        {/* Notifications */}
        <SectionTitle>Уведомления</SectionTitle>
        <Card variant="default">
          <CardContent className="divide-y divide-border px-4 py-0">
            <SettingRow label="Лайки" description="Когда кто-то лайкает ваш пост">
              <Switch isSelected={notifLikes} onChange={setNotifLikes}><SwitchControl><SwitchThumb /></SwitchControl><SwitchContent /></Switch>
            </SettingRow>
            <SettingRow label="Комментарии" description="Когда кто-то комментирует">
              <Switch isSelected={notifComments} onChange={setNotifComments}><SwitchControl><SwitchThumb /></SwitchControl><SwitchContent /></Switch>
            </SettingRow>
            <SettingRow label="Подписки" description="Когда появляется новый подписчик">
              <Switch isSelected={notifFollows} onChange={setNotifFollows}><SwitchControl><SwitchThumb /></SwitchControl><SwitchContent /></Switch>
            </SettingRow>
            <SettingRow label="Звук" description="Звуковые сигналы при уведомлениях">
              <Switch isSelected={soundOn} onChange={setSoundOn}><SwitchControl><SwitchThumb /></SwitchControl><SwitchContent /></Switch>
            </SettingRow>
          </CardContent>
        </Card>

        {/* Account */}
        <SectionTitle>Аккаунт</SectionTitle>
        <Card variant="default">
          <CardContent className="divide-y divide-border px-4 py-0">
            <SettingRow label="Профиль" description="Редактировать имя и фото">
              <Button variant="outline" size="sm" onPress={() => navigate('/profile')}>Открыть</Button>
            </SettingRow>
            <SettingRow label="Сообщения" description="Личные переписки">
              <Button variant="outline" size="sm" onPress={() => navigate('/messages')}>Открыть</Button>
            </SettingRow>
          </CardContent>
        </Card>

        {/* Password */}
        <SectionTitle>Безопасность</SectionTitle>
        <Card variant="default">
          <CardContent className="px-4 py-0">
            <SettingRow label="Пароль" description="Изменить пароль для входа">
              <Button variant="outline" size="sm" onPress={() => setPwSection(v => !v)}>
                {pwSection ? 'Свернуть' : 'Изменить'}
              </Button>
            </SettingRow>

            {pwSection && (
              <div className="flex flex-col gap-3 pb-4">
                {[
                  { label: 'Текущий пароль', value: oldPw, set: setOldPw, placeholder: '••••••••' },
                  { label: 'Новый пароль', value: newPw, set: setNewPw, placeholder: 'Минимум 6 символов' },
                  { label: 'Повторите новый', value: newPw2, set: setNewPw2, placeholder: '••••••••' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="mb-1.5 block text-xs font-medium text-muted">{f.label}</label>
                    <input
                      type="password"
                      value={f.value}
                      onChange={e => f.set(e.target.value)}
                      placeholder={f.placeholder}
                      className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                ))}
                {pwError && <p className="text-xs text-danger">{pwError}</p>}
                <Button
                  variant="primary"
                  size="sm"
                  onPress={savePassword}
                  className={pwSaved ? 'bg-success' : ''}
                >
                  {pwSaved ? '✓ Сохранено' : 'Сохранить пароль'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sessions */}
        <SectionTitle>Активные сессии</SectionTitle>
        <Card variant="default">
          <CardContent className="px-4 py-3">
            <div className="flex flex-col gap-3">
              {sessions.map(s => (
                <div key={s.id} className={`flex items-center gap-3 rounded-xl p-3 ${s.current ? 'bg-indigo-500/8 ring-1 ring-indigo-400/20' : 'bg-surface-secondary'}`}>
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-xl shadow-sm">{s.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{s.device}</p>
                      {s.current && <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">текущая</span>}
                    </div>
                    <p className="text-xs text-muted">{s.browser} · {s.os}</p>
                    <p className="text-xs text-muted">{s.location} · {s.lastActive}</p>
                  </div>
                  {!s.current && (
                    <Button variant="ghost" size="sm" className="shrink-0 text-danger hover:bg-danger/10" onPress={() => terminateSession(s.id)}>
                      Завершить
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {sessions.filter(s => !s.current).length > 0 && (
              <Button variant="outline" size="sm" className="mt-3 w-full border-danger/40 text-danger hover:bg-danger/10" onPress={terminateAll}>
                Завершить все другие сессии
              </Button>
            )}
          </CardContent>
        </Card>

        <Separator className="my-6 bg-border" />

        <Surface variant="tertiary" className="rounded-2xl p-4">
          <Text size="sm" className="mb-3 font-semibold text-danger">Опасная зона</Text>
          <Button variant="outline" size="sm" className="border-danger/40 text-danger hover:bg-danger/10" onPress={() => navigate('/')}>
            🚪 Выйти из аккаунта
          </Button>
        </Surface>

        <Text size="xs" variant="muted" className="mt-6 block text-center">SubreV v0.1.0 · Школа №1409</Text>
      </main>
    </div>
  );
}
