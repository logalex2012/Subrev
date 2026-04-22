import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Chip,
  Separator,
  Text,
} from '@heroui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { MobileBottomNav } from '../MobileBottomNav.jsx';

const NOTIFS = [];

const typeIcon = { like: '❤️', comment: '💬', follow: '👤' };
const typeColor = { like: 'danger', comment: 'accent', follow: 'success' };

function BackHeader({ title }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur-md sm:px-8">
      <Button
        isIconOnly
        variant="ghost"
        size="sm"
        onPress={() => navigate('/feed')}
        aria-label="Назад"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </Button>
      <span className="font-display font-bold tracking-tight text-foreground">{title}</span>
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}

export default function Notifications() {
  const [notifs, setNotifs] = useState(NOTIFS);

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  }

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <BackHeader title="Уведомления" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 pb-24 sm:px-6 sm:pb-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Text size="sm" variant="muted">
              {unread > 0 ? `${unread} непрочитанных` : 'Все прочитаны'}
            </Text>
          </div>
          {unread > 0 && (
            <Button variant="ghost" size="sm" onPress={markAllRead} className="text-accent">
              Прочитать все
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          {notifs.map(n => (
            <Card
              key={n.id}
              variant="default"
              className={`transition-colors ${!n.read ? 'ring-1 ring-accent/20' : ''}`}
            >
              <CardContent className="flex items-start gap-3 p-4">
                <div className="relative shrink-0">
                  <Avatar size="md">
                    <AvatarImage src={n.avatar} alt="" />
                    <AvatarFallback>{n.initials}</AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-background text-xs shadow">
                    {typeIcon[n.type]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug text-foreground">{n.text}</p>
                  <Text size="xs" variant="muted" className="mt-0.5">{n.time}</Text>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!n.read && (
                    <Chip color={typeColor[n.type]} size="sm">Новое</Chip>
                  )}
                  <Button
                    isIconOnly
                    variant="ghost"
                    size="sm"
                    className="text-muted"
                    onPress={() => setNotifs(prev => prev.filter(x => x.id !== n.id))}
                    aria-label="Удалить уведомление"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {notifs.length === 0 && (
            <Card variant="default">
              <CardContent className="py-16 text-center">
                <span className="text-4xl">🔔</span>
                <Text size="sm" variant="muted" className="mt-3 block">Уведомлений нет</Text>
              </CardContent>
            </Card>
          )}
        </div>

        <Separator className="my-6 bg-border" />
        <Text size="xs" variant="muted" className="block text-center">
          Уведомления хранятся 30 дней
        </Text>
      </main>

      <MobileBottomNav />
    </div>
  );
}
