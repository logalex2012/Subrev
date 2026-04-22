import {
  Button,
  Card,
  CardContent,
  Separator,
  Surface,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { MobileBottomNav } from '../MobileBottomNav.jsx';
import { getProfile, saveProfile, getFollowing, toggleFollow } from '../userStore.js';

const MOCK_FOLLOWERS = [];

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
      </div>
    </header>
  );
}

function EditModal({ profile, onSave, onClose }) {
  const [form, setForm] = useState({ name: profile.name, bio: profile.bio, school: profile.school });
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const fileRef = React.useRef(null);

  function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview(url);
  }

  function save() {
    const initials = form.name.trim().split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    onSave({ ...form, initials, avatar: avatarPreview });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-semibold text-foreground">Редактировать профиль</h2>
          <button onClick={onClose} className="text-muted hover:text-foreground/70">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Avatar picker */}
        <div className="mb-5 flex flex-col items-center gap-3">
          <div className="relative">
            <div className="size-20 overflow-hidden rounded-full ring-4 ring-border">
              <img src={avatarPreview} alt="Аватар" className="h-full w-full object-cover" />
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-500"
              aria-label="Изменить фото"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          <button onClick={() => fileRef.current?.click()} className="text-xs text-indigo-500 hover:underline">Изменить фото</button>
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Имя', key: 'name', placeholder: 'Иванов Иван Иванович' },
            { label: 'Биография', key: 'bio', placeholder: 'Расскажите о себе' },
            { label: 'Школа', key: 'school', placeholder: 'Школа №1409' },
          ].map(f => (
            <div key={f.key}>
              <label className="mb-1.5 block text-xs font-medium text-muted">{f.label}</label>
              <input
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-indigo-500 focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-3">
          <Button variant="ghost" size="sm" onPress={onClose}>Отмена</Button>
          <Button variant="primary" size="sm" onPress={save}>Сохранить</Button>
        </div>
      </div>
    </div>
  );
}

import React from 'react';

export default function Profile() {
  const [profile, setProfile] = useState(getProfile);
  const [following, setFollowing] = useState(getFollowing);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    function sync() { setProfile(getProfile()); }
    window.addEventListener('profile:change', sync);
    return () => window.removeEventListener('profile:change', sync);
  }, []);

  useEffect(() => {
    function sync() { setFollowing(getFollowing()); }
    window.addEventListener('following:change', sync);
    return () => window.removeEventListener('following:change', sync);
  }, []);

  function handleSave(data) {
    saveProfile(data);
    setProfile(prev => ({ ...prev, ...data }));
    setEditing(false);
  }

  const stats = [
    { label: 'Постов', value: 0 },
    { label: 'Подписчиков', value: MOCK_FOLLOWERS.length },
    { label: 'Подписок', value: following.length },
  ];

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <BackHeader title="Профиль" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:pb-6">
        {/* Cover */}
        <div className="relative h-36 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-rose-400">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Avatar row */}
        <div className="relative z-10 -mt-12 flex items-end justify-between px-3">
          <div className="size-24 overflow-hidden rounded-full ring-4 ring-background shadow-lg">
            <img src={profile.avatar} alt={profile.name} className="h-full w-full object-cover" />
          </div>
          <Button variant="outline" size="sm" className="mb-1 border-border" onPress={() => setEditing(true)}>
            Редактировать
          </Button>
        </div>

        {/* Info */}
        <div className="mt-4 flex flex-col gap-1 px-1">
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground">{profile.name}</h1>
          <Text size="sm" variant="muted" className="block">{profile.school}</Text>
          <Text size="sm" className="block text-foreground/80">{profile.bio}</Text>
          <Text size="xs" variant="muted" className="block">Присоединился: {profile.joined}</Text>
        </div>

        {/* Stats */}
        <Surface variant="secondary" className="mt-5 flex divide-x divide-border rounded-2xl">
          {stats.map(({ label, value }) => (
            <div key={label} className="flex flex-1 flex-col items-center py-4">
              <span className="font-display text-xl font-bold text-foreground">{value}</span>
              <Text size="xs" variant="muted">{label}</Text>
            </div>
          ))}
        </Surface>

        {/* Followers preview */}
        {MOCK_FOLLOWERS.length > 0 && (
          <div className="mt-3 flex items-center gap-2 px-1">
            <div className="flex -space-x-2">
              {MOCK_FOLLOWERS.map(f => (
                <div key={f.id} className="flex size-6 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[9px] font-bold text-white ring-2 ring-background">
                  {f.initials}
                </div>
              ))}
            </div>
            <Text size="xs" variant="muted">{MOCK_FOLLOWERS.map(f => f.name.split(' ')[0]).join(', ')} подписаны</Text>
          </div>
        )}

        <Separator className="my-6 bg-border" />

        {/* Tabs */}
        <Tabs defaultSelectedKey="posts">
          <TabList className="mb-4 -mx-4 overflow-x-auto px-4 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Tab id="posts">Посты</Tab>
            <Tab id="media">Медиа</Tab>
            <Tab id="likes">Понравилось</Tab>
          </TabList>
          <TabPanel id="posts">
            <Card variant="default"><CardContent className="py-14 text-center"><span className="text-4xl">✍️</span><Text size="sm" variant="muted" className="mt-3 block">Постов пока нет</Text></CardContent></Card>
          </TabPanel>
          <TabPanel id="media">
            <Card variant="default"><CardContent className="py-14 text-center"><span className="text-4xl">🖼️</span><Text size="sm" variant="muted" className="mt-3 block">Медиафайлов пока нет</Text></CardContent></Card>
          </TabPanel>
          <TabPanel id="likes">
            <Card variant="default"><CardContent className="py-14 text-center"><span className="text-4xl">❤️</span><Text size="sm" variant="muted" className="mt-3 block">Понравившихся постов пока нет</Text></CardContent></Card>
          </TabPanel>
        </Tabs>
      </main>

      {editing && <EditModal profile={profile} onSave={handleSave} onClose={() => setEditing(false)} />}

      <MobileBottomNav />
    </div>
  );
}
