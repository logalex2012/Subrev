import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  Chip,
  Surface,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
  TextArea,
  TextField,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  toast,
} from '@heroui/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { MobileMenuButton } from '../MobileMenu.jsx';
import { getProfile } from '../userStore.js';
import {
  getCommunity,
  joinCommunity,
  leaveCommunity,
  addPostToCommunity,
  reactInCommunityPost,
} from '../communityStore.js';

const REACTIONS = ['❤️', '😂', '😮', '😢', '👏'];
const TYPE_LABELS = { class: 'Класс', channel: 'Канал', community: 'Сообщество' };
const TYPE_COLORS = { class: 'accent', channel: 'warning', community: 'success' };

function BackHeader({ title }) {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-5 py-3 backdrop-blur-md sm:px-8">
      <Button isIconOnly variant="ghost" size="sm" onPress={() => navigate('/communities')} aria-label="Назад">
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

function UserAv({ src, fallback, size = 'md' }) {
  return (
    <Avatar size={size}>
      {src && <AvatarImage src={src} alt={fallback} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

function ReactionPicker({ myReaction, onReact, onClose }) {
  return (
    <div
      className="absolute bottom-full left-0 z-20 mb-2 flex items-center gap-0.5 rounded-full border border-border bg-background px-2 py-1.5 shadow-xl shadow-black/10"
      onMouseLeave={onClose}
    >
      {REACTIONS.map(r => (
        <button
          key={r}
          onClick={() => { onReact(r); onClose(); }}
          className={`flex size-9 items-center justify-center rounded-full text-xl transition-all hover:scale-125 ${myReaction === r ? 'scale-110 bg-rose-500/15' : 'hover:bg-surface-secondary'}`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}

function CommunityPost({ communityId, post, onReact }) {
  const [showPicker, setShowPicker] = useState(false);
  const longPressTimer = useRef(null);

  const reactions = post.reactions || {};
  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
  const topReactions = Object.entries(reactions)
    .filter(([, c]) => c > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([e]) => e);

  return (
    <Card variant="default" className="w-full">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <UserAv src={post.avatar} fallback={post.initials} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{post.author}</span>
              <Text size="xs" variant="muted">{post.time}</Text>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">{post.text}</p>

            {/* Reaction summary */}
            {totalReactions > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {Object.entries(reactions)
                  .filter(([, c]) => c > 0)
                  .sort(([, a], [, b]) => b - a)
                  .map(([emoji, count]) => (
                    <button
                      key={emoji}
                      onClick={() => onReact(post.id, emoji)}
                      className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all ${post.myReaction === emoji ? 'bg-rose-500/15 text-rose-500 ring-1 ring-rose-400/30' : 'bg-surface-secondary text-muted hover:bg-surface-tertiary'}`}
                    >
                      <span>{emoji}</span><span>{count}</span>
                    </button>
                  ))}
              </div>
            )}

            {/* React button */}
            <div
              className="relative mt-2 inline-block"
              onMouseEnter={() => setShowPicker(true)}
              onMouseLeave={() => setShowPicker(false)}
            >
              <button
                onTouchStart={() => { longPressTimer.current = setTimeout(() => setShowPicker(true), 500); }}
                onTouchEnd={() => clearTimeout(longPressTimer.current)}
                onTouchCancel={() => clearTimeout(longPressTimer.current)}
                onClick={() => onReact(post.id, post.myReaction || '❤️')}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-surface-secondary ${post.myReaction ? 'text-rose-500' : 'text-muted'}`}
              >
                {topReactions.length > 0 ? (
                  <span className="text-base leading-none">{topReactions.join('')}</span>
                ) : (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill={post.myReaction ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                )}
                {totalReactions > 0 && <span>{totalReactions}</span>}
              </button>
              {showPicker && (
                <ReactionPicker
                  myReaction={post.myReaction}
                  onReact={emoji => onReact(post.id, emoji)}
                  onClose={() => setShowPicker(false)}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Community() {
  const { id } = useParams();
  const navigate = useNavigate();
  const me = getProfile();
  const [community, setCommunity] = useState(() => getCommunity(id));
  const [newPost, setNewPost] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    function sync() { setCommunity(getCommunity(id)); }
    window.addEventListener('communities:change', sync);
    return () => window.removeEventListener('communities:change', sync);
  }, [id]);

  if (!community) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-background text-foreground">
        <span className="text-5xl">🏛</span>
        <Text size="lg" className="mt-4 font-semibold">Сообщество не найдено</Text>
        <Button variant="primary" size="sm" className="mt-4" onPress={() => navigate('/communities')}>
          К сообществам
        </Button>
      </div>
    );
  }

  function handleJoin() {
    joinCommunity(id);
    toast.success(`Вы вступили в «${community.name}»!`);
  }

  function handleLeave() {
    leaveCommunity(id);
    toast.success('Вы вышли из сообщества');
  }

  function handlePublish() {
    if (!newPost.trim()) return;
    addPostToCommunity(id, {
      author: me.name,
      initials: me.initials,
      avatar: me.avatar,
      text: newPost.trim(),
      time: 'только что',
      reactions: {},
      myReaction: null,
      comments: [],
    });
    setNewPost('');
    toast.success('Пост опубликован!');
  }

  function handleReact(postId, emoji) {
    reactInCommunityPost(id, postId, emoji);
  }

  function handleShare() {
    const url = `${window.location.origin}/community/${id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        toast.success('Ссылка скопирована!', { description: url });
        setTimeout(() => setCopied(false), 2500);
      });
    } else {
      toast.success('Ссылка', { description: url });
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <BackHeader title={community.name} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-0 sm:px-6">
        {/* Cover + hero */}
        <div className={`relative h-40 overflow-hidden bg-gradient-to-br ${community.cover}`}>
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="relative z-10 -mt-8 px-4">
          {/* Emoji avatar */}
          <div className={`flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${community.cover} text-3xl shadow-xl ring-4 ring-background`}>
            {community.emoji}
          </div>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight text-foreground">{community.name}</h1>
                <Chip size="sm" color={TYPE_COLORS[community.type] ?? 'default'} className="text-[10px]">
                  {TYPE_LABELS[community.type] ?? community.type}
                </Chip>
              </div>
              <Text size="sm" variant="muted" className="mt-0.5 block">{community.description}</Text>
              <Text size="xs" variant="muted" className="mt-1 block">👥 {community.memberCount} участников · с {community.createdAt}</Text>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2 pt-1">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    isIconOnly
                    variant="outline"
                    size="sm"
                    onPress={handleShare}
                    className={copied ? 'border-emerald-400/50 text-emerald-600' : ''}
                    aria-label="Поделиться ссылкой"
                  >
                    {copied ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                      </svg>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Поделиться ссылкой</TooltipContent>
              </Tooltip>

              {community.joined ? (
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none" onPress={handleLeave}>Выйти</Button>
              ) : (
                <Button variant="primary" size="sm" className="flex-1 sm:flex-none" onPress={handleJoin}>Вступить</Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 px-0">
          <Tabs defaultSelectedKey="posts">
            <TabList className="mb-6 -mx-4 overflow-x-auto px-4 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Tab id="posts">Посты {community.posts.length > 0 && <span className="ml-1 rounded-full bg-surface-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted">{community.posts.length}</span>}</Tab>
              <Tab id="members">Участники {community.members?.length > 0 && <span className="ml-1 rounded-full bg-surface-secondary px-1.5 py-0.5 text-[10px] font-bold text-muted">{community.memberCount}</span>}</Tab>
              <Tab id="about">О сообществе</Tab>
            </TabList>

            <TabPanel id="posts">
              <div className="flex flex-col gap-4 px-4 pb-8">
                {/* New post (only for joined members) */}
                {community.joined && (
                  <Card variant="default" className="w-full">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <UserAv src={me.avatar} fallback={me.initials} />
                        <div className="flex-1">
                          <TextField fullWidth>
                            <TextArea
                              value={newPost}
                              onChange={e => setNewPost(e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handlePublish(); }}
                              placeholder={`Написать в ${community.name}…`}
                              rows={2}
                            />
                          </TextField>
                          <div className="mt-2 flex justify-end">
                            <Button variant="primary" size="sm" isDisabled={!newPost.trim()} onPress={handlePublish}>
                              Опубликовать
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Posts list */}
                {community.posts.length === 0 ? (
                  <div className="py-12 text-center">
                    <span className="text-5xl">📭</span>
                    <Text size="lg" className="mt-3 block font-semibold text-foreground">Постов пока нет</Text>
                    {community.joined && (
                      <Text size="sm" variant="muted" className="mt-1 block">Будьте первым!</Text>
                    )}
                    {!community.joined && (
                      <Button variant="primary" size="sm" className="mt-4" onPress={handleJoin}>Вступить и написать</Button>
                    )}
                  </div>
                ) : (
                  community.posts.map(post => (
                    <CommunityPost key={post.id} communityId={id} post={post} onReact={handleReact} />
                  ))
                )}
              </div>
            </TabPanel>

            <TabPanel id="members">
              <div className="flex flex-col gap-2 px-4 pb-8">
                {(community.members?.length > 0 ? community.members : []).map(member => (
                  <div key={member.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-secondary">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="size-9 rounded-full object-cover" />
                    ) : (
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">
                        {member.initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{member.name}</p>
                      <p className="text-xs text-muted">{member.role}</p>
                    </div>
                  </div>
                ))}
                {(community.members?.length ?? 0) === 0 && (
                  <div className="py-10 text-center">
                    <Text size="sm" variant="muted">Список участников недоступен</Text>
                  </div>
                )}
              </div>
            </TabPanel>

            <TabPanel id="about">
              <div className="flex flex-col gap-4 px-4 pb-8">
                <Surface variant="secondary" className="rounded-2xl p-4">
                  <Text size="sm" className="mb-1 font-semibold text-foreground">Описание</Text>
                  <Text size="sm" variant="muted">{community.description || 'Описание не указано'}</Text>
                </Surface>

                <Surface variant="secondary" className="rounded-2xl p-4">
                  <div className="flex flex-col gap-2">
                    {[
                      { label: 'Тип', value: TYPE_LABELS[community.type] ?? community.type },
                      { label: 'Участники', value: `${community.memberCount} чел.` },
                      { label: 'Создано', value: community.createdAt },
                      { label: 'Постов', value: community.posts.length },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <Text size="sm" variant="muted">{label}</Text>
                        <Text size="sm" className="font-medium text-foreground">{value}</Text>
                      </div>
                    ))}
                  </div>
                </Surface>

                {/* Invite link */}
                <Surface variant="secondary" className="rounded-2xl p-4">
                  <Text size="sm" className="mb-2 font-semibold text-foreground">Пригласить по ссылке</Text>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 truncate rounded-xl border border-border bg-background px-3 py-2 text-xs text-muted font-mono">
                      {window.location.origin}/community/{id}
                    </div>
                    <Button variant="primary" size="sm" onPress={handleShare}>
                      {copied ? '✓' : 'Скопировать'}
                    </Button>
                  </div>
                  <Text size="xs" variant="muted" className="mt-2 block">
                    Любой пользователь по этой ссылке сможет вступить в сообщество
                  </Text>
                </Surface>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
