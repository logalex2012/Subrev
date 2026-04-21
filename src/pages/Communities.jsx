import {
  Button,
  Card,
  CardContent,
  Chip,
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseTrigger,
  ModalContainer,
  ModalDialog,
  ModalFooter,
  ModalHeader,
  ModalHeading,
  ModalTrigger,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  toast,
} from '@heroui/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { getCommunities, joinCommunity, leaveCommunity, createCommunity } from '../communityStore.js';

const TYPE_LABELS = { class: 'Класс', channel: 'Канал', community: 'Сообщество' };
const TYPE_COLORS = { class: 'accent', channel: 'warning', community: 'success' };

const EMOJI_PRESETS = ['🏫', '💬', '📰', '💻', '🎨', '⚽', '🎸', '📚', '🌍', '🎬', '🎮', '🏆', '🔬', '🎭', '✏️', '🌱'];

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
      <div className="ml-auto"><ThemeToggle /></div>
    </header>
  );
}

function CommunityCard({ community, onJoin, onLeave, onClick }) {
  return (
    <Card variant="default" className="w-full cursor-pointer transition-all hover:shadow-md" onClick={onClick}>
      <CardContent className="p-0">
        {/* Cover strip */}
        <div className={`h-16 rounded-t-2xl bg-gradient-to-r ${community.cover}`} />
        <div className="relative px-4 pb-4 pt-3">
          {/* Emoji avatar */}
          <div className={`absolute -top-6 left-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br ${community.cover} text-2xl shadow-lg ring-2 ring-background`}>
            {community.emoji}
          </div>

          <div className="mt-7">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-foreground">{community.name}</h3>
                  <Chip size="sm" color={TYPE_COLORS[community.type] ?? 'default'} className="text-[10px]">
                    {TYPE_LABELS[community.type] ?? community.type}
                  </Chip>
                </div>
                <p className="mt-1 line-clamp-2 text-xs text-muted">{community.description}</p>
                <p className="mt-2 text-xs text-muted">👥 {community.memberCount} участников · с {community.createdAt}</p>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              {community.joined ? (
                <>
                  <Button variant="outline" size="sm" className="flex-1" onPress={e => { e.stopPropagation(); onClick(); }}>
                    Открыть
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted"
                    onPress={e => { e.stopPropagation(); onLeave(community.id); }}
                  >
                    Выйти
                  </Button>
                </>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onPress={e => { e.stopPropagation(); onJoin(community.id); }}
                >
                  Вступить
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('community');
  const [emoji, setEmoji] = useState('💬');
  const [customEmoji, setCustomEmoji] = useState('');
  const [error, setError] = useState('');

  function handleCreate() {
    if (!name.trim()) { setError('Введите название'); return; }
    if (name.trim().length < 3) { setError('Название слишком короткое'); return; }
    const finalEmoji = customEmoji.trim() || emoji;
    onCreate({ name: name.trim(), description: description.trim(), type, emoji: finalEmoji });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-3xl bg-background p-6 shadow-2xl sm:rounded-3xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Создать сообщество</h2>
          <Button isIconOnly variant="ghost" size="sm" onPress={onClose} aria-label="Закрыть">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden>
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Type selector */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted">Тип</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(TYPE_LABELS).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`rounded-xl border px-3 py-2.5 text-sm transition-all ${type === t ? 'border-indigo-500 bg-indigo-500/10 font-medium text-indigo-600 dark:text-indigo-400' : 'border-border text-muted hover:border-border/80 hover:text-foreground/70'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Emoji picker */}
          <div>
            <label className="mb-2 block text-xs font-medium text-muted">Иконка</label>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_PRESETS.map(e => (
                <button
                  key={e}
                  onClick={() => { setEmoji(e); setCustomEmoji(''); }}
                  className={`flex size-9 items-center justify-center rounded-xl text-xl transition-all hover:scale-110 ${emoji === e && !customEmoji ? 'bg-indigo-500/15 ring-2 ring-indigo-400/40' : 'bg-surface-secondary hover:bg-surface-tertiary'}`}
                >
                  {e}
                </button>
              ))}
            </div>
            <input
              value={customEmoji}
              onChange={e => setCustomEmoji(e.target.value)}
              placeholder="Или введите свой эмодзи…"
              maxLength={2}
              className="mt-2 w-full rounded-xl border border-border bg-surface-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Название *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: 9А класс"
              maxLength={50}
              className="w-full rounded-xl border border-border bg-surface-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="О чём это сообщество?"
              rows={2}
              maxLength={200}
              className="w-full resize-none rounded-xl border border-border bg-surface-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-danger">{error}</p>}

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onPress={onClose}>Отмена</Button>
            <Button variant="primary" className="flex-1" onPress={handleCreate}>Создать</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Communities() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState(getCommunities);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    function sync() { setCommunities(getCommunities()); }
    window.addEventListener('communities:change', sync);
    return () => window.removeEventListener('communities:change', sync);
  }, []);

  function handleJoin(id) {
    joinCommunity(id);
    const c = getCommunities().find(c => c.id === id);
    toast.success(`Вы вступили в «${c?.name}»!`);
  }

  function handleLeave(id) {
    leaveCommunity(id);
    toast.success('Вы вышли из сообщества');
  }

  function handleCreate(data) {
    const c = createCommunity(data);
    toast.success(`Сообщество «${c.name}» создано!`);
    navigate(`/community/${c.id}`);
  }

  const filtered = communities.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.description.toLowerCase().includes(search.toLowerCase())
  );
  const joined = filtered.filter(c => c.joined);
  const discover = filtered.filter(c => !c.joined);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <BackHeader title="Сообщества" />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        {/* Search + create */}
        <div className="mb-6 flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Поиск сообществ…"
              className="w-full rounded-xl border border-border bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-indigo-500 focus:outline-none"
            />
          </div>
          <Button variant="primary" onPress={() => setShowCreate(true)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5" aria-hidden>
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Создать
          </Button>
        </div>

        <Tabs defaultSelectedKey="joined">
          <TabList className="mb-6">
            <Tab id="joined">Мои {joined.length > 0 && <span className="ml-1 rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-500">{joined.length}</span>}</Tab>
            <Tab id="discover">Найти {discover.length > 0 && <span className="ml-1 rounded-full bg-surface-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted">{discover.length}</span>}</Tab>
          </TabList>

          <TabPanel id="joined">
            {joined.length === 0 ? (
              <div className="py-16 text-center">
                <span className="text-5xl">🏛</span>
                <Text size="lg" className="mt-3 block font-semibold text-foreground">Вы ни в одном сообществе</Text>
                <Text size="sm" variant="muted" className="mt-1 block">Вступите в существующее или создайте своё</Text>
                <Button variant="primary" size="sm" className="mt-4" onPress={() => setShowCreate(true)}>Создать сообщество</Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {joined.map(c => (
                  <CommunityCard
                    key={c.id}
                    community={c}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    onClick={() => navigate(`/community/${c.id}`)}
                  />
                ))}
              </div>
            )}
          </TabPanel>

          <TabPanel id="discover">
            {discover.length === 0 ? (
              <div className="py-16 text-center">
                <span className="text-5xl">🔍</span>
                <Text size="lg" className="mt-3 block font-semibold text-foreground">
                  {search ? 'Ничего не найдено' : 'Вы уже везде вступили!'}
                </Text>
                <Text size="sm" variant="muted" className="mt-1 block">
                  {search ? 'Попробуйте другой запрос' : 'Создайте новое сообщество'}
                </Text>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {discover.map(c => (
                  <CommunityCard
                    key={c.id}
                    community={c}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    onClick={() => navigate(`/community/${c.id}`)}
                  />
                ))}
              </div>
            )}
          </TabPanel>
        </Tabs>
      </main>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
