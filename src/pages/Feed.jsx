import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  BadgeAnchor,
  Button,
  Card,
  CardContent,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownPopover,
  DropdownTrigger,
  EmptyState,
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
  Separator,
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
import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { MobileMenuButton } from '../MobileMenu.jsx';
import { getChangelog } from '../changelog.js';
import { getProfile, getFollowing, toggleFollow } from '../userStore.js';
import { getCommunities } from '../communityStore.js';

const REACTIONS = ['❤️', '😂', '😮', '😢', '👏'];

const INITIAL_POSTS = [];

const MOCK_USERS = [
  { id: 'teacher1', name: 'Мария Петрова', initials: 'МП', role: 'Учитель', avatar: null },
  { id: 'student1', name: 'Иван Смирнов', initials: 'ИС', role: 'Ученик 9А', avatar: null },
  { id: 'student2', name: 'Анна Козлова', initials: 'АК', role: 'Ученик 9А', avatar: null },
];

const MOCK_FOLLOWING_POSTS = [
  { id: -1, authorId: 'teacher1', author: 'Мария Петрова', initials: 'МП', avatar: null, time: '2 ч назад', text: 'Завтра контрольная по математике! Не забудьте повторить #производные и #интегралы. Удачи всем! 📚', tag: 'Объявление', privacy: 'public', reactions: { '❤️': 12 }, myReaction: null, comments: [], media: [] },
  { id: -2, authorId: 'student1', author: 'Иван Смирнов', initials: 'ИС', avatar: null, time: '4 ч назад', text: 'Всем привет! Кто хочет погонять в футбол после уроков? #спорт #9А', tag: 'Вопрос', privacy: 'public', reactions: { '👏': 5 }, myReaction: null, comments: [], media: [] },
];

const PRIVACY_OPTIONS = [
  { id: 'public', label: 'Все', icon: '🌍' },
  { id: 'class', label: 'Класс', icon: '🏫' },
  { id: 'friends', label: 'Друзья', icon: '👥' },
];

function UserAvatar({ src, fallback, size = 'md' }) {
  return (
    <Avatar size={size}>
      {src && <AvatarImage src={src} alt={fallback} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

function PostText({ text, onHashtag }) {
  if (!text) return null;
  const parts = text.split(/(#[\w\u0400-\u04FF]+)/g);
  return (
    <p className="mt-3 text-sm leading-relaxed text-foreground/85">
      {parts.map((part, i) =>
        /^#[\w\u0400-\u04FF]+$/.test(part) ? (
          <button
            key={i}
            onClick={() => onHashtag(part)}
            className="font-medium text-indigo-500 hover:underline dark:text-indigo-400"
          >
            {part}
          </button>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </p>
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

function PostCard({ post, onReact, onComment, onDelete, onRepost, onHashtag }) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const inputRef = useRef(null);
  const longPressTimer = useRef(null);
  const me = getProfile();

  function submitComment(e) {
    e?.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText.trim());
    setCommentText('');
    toast.success('Комментарий добавлен');
  }

  function startLongPress() {
    longPressTimer.current = setTimeout(() => setShowPicker(true), 500);
  }
  function endLongPress() {
    clearTimeout(longPressTimer.current);
  }

  const reactions = post.reactions || {};
  const totalReactions = Object.values(reactions).reduce((a, b) => a + b, 0);
  const topReactions = Object.entries(reactions)
    .filter(([, c]) => c > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([e]) => e);

  const tagColor = { Новость: 'accent', Объявление: 'warning', Вопрос: 'success' }[post.tag] ?? 'default';
  const privacyIcon = { class: '🏫', friends: '👥' }[post.privacy] ?? null;

  return (
    <Card variant="default" className="w-full">
      <CardContent className="p-5">
        {/* Repost header */}
        {post.repostOf && (
          <div className="mb-3 flex items-center gap-2 text-xs text-muted">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
            </svg>
            <span>Репост</span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <UserAvatar src={post.avatar} fallback={post.initials} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{post.author}</span>
                <Chip size="sm" color={tagColor} className="text-[10px]">{post.tag}</Chip>
                {privacyIcon && <span className="text-xs" title={PRIVACY_OPTIONS.find(p => p.id === post.privacy)?.label}>{privacyIcon}</span>}
              </div>
              <Text size="xs" variant="muted">{post.time}</Text>
            </div>
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="ghost" size="sm" className="text-muted" aria-label="Опции">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
                </svg>
              </Button>
            </DropdownTrigger>
            <DropdownPopover>
              <DropdownMenu>
                <DropdownItem onAction={() => onRepost(post)}>🔄 Поделиться</DropdownItem>
                <DropdownItem
                  className="text-danger"
                  onAction={() => { onDelete(post.id); toast.danger('Пост удалён'); }}
                >
                  🗑 Удалить пост
                </DropdownItem>
              </DropdownMenu>
            </DropdownPopover>
          </Dropdown>
        </div>

        {/* Original post content if repost */}
        {post.repostOf && (
          <div className="mt-3 rounded-xl border border-border bg-surface-secondary p-3">
            <div className="mb-1 flex items-center gap-2">
              <UserAvatar src={post.repostOf.avatar} fallback={post.repostOf.initials} size="sm" />
              <span className="text-xs font-semibold text-foreground">{post.repostOf.author}</span>
            </div>
            <p className="line-clamp-3 text-sm text-foreground/70">{post.repostOf.text}</p>
          </div>
        )}

        {/* Text with hashtags */}
        {post.text && <PostText text={post.text} onHashtag={onHashtag} />}

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className={`mt-3 grid gap-2 overflow-hidden rounded-xl ${post.media.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {post.media.map((item, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-xl bg-surface-secondary">
                {item.type?.startsWith('video/') ? (
                  <video src={item.url} controls className="max-h-80 w-full object-cover" preload="metadata" />
                ) : (
                  <img src={item.url} alt={item.name} className={`w-full object-cover ${post.media.length === 1 ? 'max-h-96' : 'h-40'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Reaction summary row */}
        {totalReactions > 0 && (
          <div className="mt-3 flex items-center gap-1.5">
            {Object.entries(reactions)
              .filter(([, c]) => c > 0)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 4)
              .map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => onReact(post.id, emoji)}
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all ${post.myReaction === emoji ? 'bg-rose-500/15 text-rose-500 ring-1 ring-rose-400/30' : 'bg-surface-secondary text-muted hover:bg-surface-tertiary'}`}
                >
                  <span>{emoji}</span>
                  <span>{count}</span>
                </button>
              ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-3 flex items-center gap-1">
          {/* Reaction button with picker */}
          <div
            className="relative"
            onMouseEnter={() => setShowPicker(true)}
            onMouseLeave={() => setShowPicker(false)}
          >
            <button
              onTouchStart={startLongPress}
              onTouchEnd={endLongPress}
              onTouchCancel={endLongPress}
              onClick={() => onReact(post.id, post.myReaction || '❤️')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-colors hover:bg-surface-secondary ${post.myReaction ? 'text-rose-500' : 'text-muted'}`}
              aria-label="Реакция"
            >
              {topReactions.length > 0 ? (
                <span className="text-base leading-none">{topReactions.join('')}</span>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill={post.myReaction ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
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

          <Tooltip>
            <TooltipTrigger>
              <Button
                isIconOnly variant="ghost" size="sm"
                className="gap-1.5 px-3 text-xs font-normal text-muted"
                onPress={() => { setShowComments(v => !v); if (!showComments) setTimeout(() => inputRef.current?.focus(), 100); }}
                aria-label="Комментарии"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                {post.comments.length}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Комментарии</TooltipContent>
          </Tooltip>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            {post.comments.map(c => (
              <div key={c.id} className="flex items-start gap-2">
                <UserAvatar src={c.avatar} fallback={c.initials} size="sm" />
                <Surface variant="secondary" className="min-w-0 flex-1 rounded-xl px-3 py-2">
                  <span className="text-xs font-semibold text-foreground">{c.author} </span>
                  <span className="text-xs text-foreground/80">{c.text}</span>
                </Surface>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <UserAvatar src={me.avatar} fallback={me.initials} size="sm" />
              <form onSubmit={submitComment} className="flex flex-1 items-center gap-2">
                <TextField fullWidth>
                  <TextArea
                    ref={inputRef}
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Написать комментарий…"
                    rows={1}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submitComment(); } }}
                    className="resize-none py-2 text-xs"
                  />
                </TextField>
                <Button type="submit" variant="primary" size="sm" isIconOnly isDisabled={!commentText.trim()} aria-label="Отправить">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                  </svg>
                </Button>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function NewPostEditor({ onPublish }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [tag, setTag] = useState('Новость');
  const [privacy, setPrivacy] = useState('public');
  const [media, setMedia] = useState([]);
  const taRef = useRef(null);
  const fileRef = useRef(null);
  const me = getProfile();

  const tags = ['Новость', 'Вопрос', 'Объявление'];
  const tagColor = { Новость: 'accent', Вопрос: 'success', Объявление: 'warning' };

  function handleFiles(files) {
    const items = Array.from(files).map(f => ({ url: URL.createObjectURL(f), type: f.type || 'image/gif', name: f.name }));
    setMedia(prev => [...prev, ...items].slice(0, 4));
  }

  function removeMedia(idx) {
    setMedia(prev => { URL.revokeObjectURL(prev[idx].url); return prev.filter((_, i) => i !== idx); });
  }

  function publish() {
    if (!text.trim() && media.length === 0) return;
    onPublish(text.trim(), tag, media, privacy);
    setText(''); setTag('Новость'); setPrivacy('public'); setMedia([]); setOpen(false);
    toast.success('Пост опубликован!', { description: 'Ваш пост появился в ленте.' });
  }

  function reset() {
    media.forEach(m => URL.revokeObjectURL(m.url));
    setText(''); setMedia([]); setOpen(false);
  }

  return (
    <Card variant="default" className="w-full">
      <CardContent className="p-4">
        {!open ? (
          <div className="flex items-center gap-3">
            <UserAvatar src={me.avatar} fallback={me.initials} />
            <button
              onClick={() => { setOpen(true); setTimeout(() => taRef.current?.focus(), 50); }}
              className="flex-1 rounded-full border border-border bg-surface-secondary px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-surface-tertiary"
            >
              Что нового?
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <UserAvatar src={me.avatar} fallback={me.initials} />
              <TextField fullWidth>
                <TextArea
                  ref={taRef}
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) publish(); }}
                  placeholder="Напишите что-нибудь… #хэштеги поддерживаются"
                  rows={3}
                />
              </TextField>
            </div>

            {/* Media previews */}
            {media.length > 0 && (
              <div className={`grid gap-2 pl-[52px] ${media.length >= 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {media.map((item, idx) => (
                  <div key={idx} className="group relative overflow-hidden rounded-xl bg-surface-secondary">
                    {item.type.startsWith('video/') ? (
                      <video src={item.url} className="max-h-48 w-full object-cover" preload="metadata" />
                    ) : (
                      <img src={item.url} alt={item.name} className={`w-full object-cover ${media.length === 1 ? 'max-h-64' : 'h-32'}`} />
                    )}
                    <button onClick={() => removeMedia(idx)} className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100" aria-label="Удалить">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden>
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Tag + privacy */}
            <div className="flex flex-wrap items-center gap-2 pl-[52px]">
              <Text size="xs" variant="muted" className="shrink-0">Тема:</Text>
              {tags.map(t => (
                <Chip key={t} color={tag === t ? tagColor[t] : 'default'} className={`cursor-pointer text-xs transition-opacity ${tag !== t ? 'opacity-50 hover:opacity-80' : ''}`} onClick={() => setTag(t)}>
                  {t}
                </Chip>
              ))}
              <span className="ml-2 text-muted">·</span>
              <Text size="xs" variant="muted" className="shrink-0">Видят:</Text>
              {PRIVACY_OPTIONS.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPrivacy(p.id)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs transition-all ${privacy === p.id ? 'bg-surface-tertiary font-semibold text-foreground ring-1 ring-border' : 'text-muted hover:text-foreground/70'}`}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between pl-[52px]">
              <div className="flex items-center gap-1">
                <input ref={fileRef} type="file" accept="image/*,video/*,.gif" multiple className="hidden" onChange={e => { if (e.target.files) handleFiles(e.target.files); e.target.value = ''; }} />
                <Tooltip>
                  <TooltipTrigger>
                    <Button isIconOnly variant="ghost" size="sm" className="text-muted" isDisabled={media.length >= 4} onPress={() => { fileRef.current.accept = 'image/*,.gif'; fileRef.current.click(); }} aria-label="Прикрепить фото или GIF">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Фото / GIF</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger>
                    <Button isIconOnly variant="ghost" size="sm" className="text-muted" isDisabled={media.length >= 4} onPress={() => { fileRef.current.accept = 'video/*'; fileRef.current.click(); }} aria-label="Прикрепить видео">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Видео</TooltipContent>
                </Tooltip>
                {media.length > 0 && <Text size="xs" variant="muted" className="ml-1">{media.length}/4</Text>}
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onPress={reset}>Отмена</Button>
                <Button variant="primary" size="sm" isDisabled={!text.trim() && media.length === 0} onPress={publish}>Опубликовать</Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Feed() {
  const navigate = useNavigate();
  const me = getProfile();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [followingPosts, setFollowingPosts] = useState(MOCK_FOLLOWING_POSTS);
  const [communities, setCommunities] = useState(getCommunities);
  const nextId = useRef(INITIAL_POSTS.length + 1);
  const [notifCount] = useState(3);
  const [changelog, setChangelog] = useState(getChangelog);
  const [following, setFollowing] = useState(getFollowing);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  // Hashtag filter
  const [activeHashtag, setActiveHashtag] = useState(null);

  useEffect(() => {
    function sync() { setChangelog(getChangelog()); }
    window.addEventListener('changelog:change', sync);
    return () => window.removeEventListener('changelog:change', sync);
  }, []);

  useEffect(() => {
    function sync() { setFollowing(getFollowing()); }
    window.addEventListener('following:change', sync);
    return () => window.removeEventListener('following:change', sync);
  }, []);

  useEffect(() => {
    function sync() { setCommunities(getCommunities()); }
    window.addEventListener('communities:change', sync);
    return () => window.removeEventListener('communities:change', sync);
  }, []);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
    else setSearchQuery('');
  }, [searchOpen]);

  function handleReact(id, emoji) {
    const update = prev => prev.map(p => {
      if (p.id !== id) return p;
      const reactions = { ...(p.reactions || {}) };
      if (p.myReaction === emoji) {
        reactions[emoji] = (reactions[emoji] ?? 1) - 1;
        if (reactions[emoji] <= 0) delete reactions[emoji];
        return { ...p, reactions, myReaction: null };
      }
      if (p.myReaction) {
        reactions[p.myReaction] = (reactions[p.myReaction] ?? 1) - 1;
        if (reactions[p.myReaction] <= 0) delete reactions[p.myReaction];
      }
      reactions[emoji] = (reactions[emoji] ?? 0) + 1;
      return { ...p, reactions, myReaction: emoji };
    });
    setPosts(update);
    setFollowingPosts(update);
  }

  function handleComment(postId, text) {
    const update = prev => prev.map(p =>
      p.id === postId ? { ...p, comments: [...p.comments, { id: Date.now(), author: me.name, avatar: me.avatar, initials: me.initials, text }] } : p
    );
    setPosts(update);
    setFollowingPosts(update);
  }

  function handleDelete(id) {
    setPosts(prev => prev.filter(p => p.id !== id));
    setFollowingPosts(prev => prev.filter(p => p.id !== id));
  }

  function handleRepost(originalPost) {
    const newPost = {
      id: nextId.current++,
      author: me.name,
      avatar: me.avatar,
      initials: me.initials,
      time: 'только что',
      text: '',
      tag: originalPost.tag,
      privacy: 'public',
      media: [],
      reactions: {},
      myReaction: null,
      comments: [],
      repostOf: { id: originalPost.id, author: originalPost.author, avatar: originalPost.avatar, initials: originalPost.initials, text: originalPost.text },
    };
    setPosts(prev => [newPost, ...prev]);
    toast.success('Репост опубликован!');
  }

  function handlePublish(text, tag, media = [], privacy = 'public') {
    setPosts(prev => [{
      id: nextId.current++,
      author: me.name,
      avatar: me.avatar,
      initials: me.initials,
      time: 'только что',
      text, tag, privacy, media,
      reactions: {},
      myReaction: null,
      comments: [],
    }, ...prev]);
  }

  function handleHashtag(tag) {
    setActiveHashtag(prev => prev === tag ? null : tag);
    setSearchOpen(false);
  }

  // Filter for main feed
  const q = searchQuery.toLowerCase();
  const filteredPosts = posts.filter(p => {
    if (activeHashtag) return p.text?.toLowerCase().includes(activeHashtag.toLowerCase());
    if (q) return p.text?.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    return true;
  });

  const filteredFollowingPosts = followingPosts.filter(p => {
    if (activeHashtag) return p.text?.toLowerCase().includes(activeHashtag.toLowerCase());
    if (q) return p.text?.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    return true;
  });

  const filteredUsers = MOCK_USERS.filter(u =>
    q && u.name.toLowerCase().includes(q)
  );

  const joinedCommunities = communities.filter(c => c.joined);

  const CARD_PROPS = { onReact: handleReact, onComment: handleComment, onDelete: handleDelete, onRepost: handleRepost, onHashtag: handleHashtag };

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <div className="flex items-center gap-2.5">
            <MobileMenuButton className="sm:hidden" />
            <img src="/icon1ej.png" alt="SubreV" className="size-8 rounded-xl" />
            <span className="font-display text-lg font-bold tracking-tight">SubreV</span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Search toggle */}
            <Tooltip>
              <TooltipTrigger>
                <Button isIconOnly variant={searchOpen ? 'secondary' : 'ghost'} size="sm" className="hidden text-muted sm:inline-flex" onPress={() => setSearchOpen(v => !v)} aria-label="Поиск">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="hidden sm:block">Поиск</TooltipContent>
            </Tooltip>

            {/* Messages */}
            <Tooltip>
              <TooltipTrigger>
                <Button isIconOnly variant="ghost" size="sm" className="hidden text-muted sm:inline-flex" onPress={() => navigate('/messages')} aria-label="Сообщения">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="hidden sm:block">Сообщения</TooltipContent>
            </Tooltip>

            {/* Новости */}
            <Modal>
              <ModalTrigger>
                <Tooltip>
                  <TooltipTrigger>
                    <Button isIconOnly variant="ghost" size="sm" className="relative text-muted" aria-label="Новости обновлений">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                      </svg>
                      <span className="absolute right-0.5 top-0.5 size-2 rounded-full bg-indigo-500 ring-1 ring-background" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Обновления</TooltipContent>
                </Tooltip>
              </ModalTrigger>
              <ModalBackdrop>
                <ModalContainer size="md">
                  <ModalDialog>
                    <ModalHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg">🚀</div>
                        <div>
                          <ModalHeading className="text-lg font-bold tracking-tight">Обновления SubreV</ModalHeading>
                          <p className="text-xs text-muted">Что нового в приложении</p>
                        </div>
                      </div>
                      <ModalCloseTrigger />
                    </ModalHeader>
                    <ModalBody className="space-y-5">
                      {changelog.map(release => (
                        <div key={release.id ?? release.version}>
                          <div className="mb-3 flex items-center gap-2.5">
                            <span className="font-display text-base font-bold tracking-tight text-foreground">{release.version}</span>
                            {release.badge && <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-400">{release.badge}</span>}
                            <span className="ml-auto text-xs text-muted">{release.date}</span>
                          </div>
                          <ul className="space-y-2">
                            {release.items.map(item => (
                              <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                                <span className="mt-0.5 shrink-0">{item.slice(0, 2)}</span>
                                <span>{item.slice(2).trim()}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="rounded-xl border border-border bg-surface-secondary px-4 py-3 text-xs text-muted">SubreV активно развивается. Следи за обновлениями!</div>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="primary" fullWidth slot="close">Отлично!</Button>
                    </ModalFooter>
                  </ModalDialog>
                </ModalContainer>
              </ModalBackdrop>
            </Modal>

            {/* Notifications */}
            <Tooltip>
              <TooltipTrigger>
                <BadgeAnchor>
                  <Button isIconOnly variant="ghost" size="sm" className="hidden text-muted sm:inline-flex" aria-label={`Уведомления: ${notifCount}`} onPress={() => navigate('/notifications')}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </Button>
                  <Badge color="danger" size="sm">{notifCount}</Badge>
                </BadgeAnchor>
              </TooltipTrigger>
              <TooltipContent className="hidden sm:block">{notifCount} новых уведомления</TooltipContent>
            </Tooltip>

            {/* Profile dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <button className="hidden items-center gap-2 rounded-full p-1 transition-colors hover:bg-surface-secondary sm:flex" aria-label="Профиль">
                  <UserAvatar src={me.avatar} fallback={me.initials} size="sm" />
                </button>
              </DropdownTrigger>
              <DropdownPopover>
                <DropdownMenu>
                  <DropdownItem onAction={() => navigate('/profile')}>👤 Профиль</DropdownItem>
                  <DropdownItem onAction={() => navigate('/communities')}>🏛 Сообщества</DropdownItem>
                  <DropdownItem onAction={() => navigate('/messages')}>💬 Сообщения</DropdownItem>
                  <DropdownItem onAction={() => navigate('/settings')}>⚙️ Настройки</DropdownItem>
                  <DropdownItem className="text-danger" onAction={() => navigate('/')}>🚪 Выйти</DropdownItem>
                </DropdownMenu>
              </DropdownPopover>
            </Dropdown>
          </div>
        </div>

        {/* Search panel */}
        {searchOpen && (
          <div className="border-t border-border px-5 py-3 sm:px-8">
            <div className="relative">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchInputRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                placeholder="Поиск постов, людей, #хэштегов…"
                className="w-full rounded-xl border border-border bg-surface-secondary py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted focus:border-indigo-500 focus:outline-none"
              />
            </div>
            {/* User results */}
            {filteredUsers.length > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                {filteredUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => { toggleFollow(u.id); toast.success(following.includes(u.id) ? `Вы отписались от ${u.name}` : `Вы подписались на ${u.name}`); }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-surface-secondary"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">{u.initials}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted">{u.role}</p>
                    </div>
                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${following.includes(u.id) ? 'bg-surface-tertiary text-muted' : 'bg-indigo-600 text-white'}`}>
                      {following.includes(u.id) ? 'Отписаться' : 'Подписаться'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Active hashtag banner */}
        {activeHashtag && (
          <div className="flex items-center gap-2 border-t border-border bg-indigo-500/8 px-5 py-2 sm:px-8">
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">{activeHashtag}</span>
            <Text size="xs" variant="muted">— фильтр по хэштегу</Text>
            <button onClick={() => setActiveHashtag(null)} className="ml-auto text-xs text-muted underline hover:text-foreground/70">Сбросить</button>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        <Tabs defaultSelectedKey="feed">
          <TabList className="mb-6 -mx-4 overflow-x-auto px-4 whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <Tab id="feed">Лента</Tab>
            <Tab id="following">Подписки {following.length > 0 && <span className="ml-1 rounded-full bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-500">{following.length}</span>}</Tab>
            <Tab id="communities">Сообщества {joinedCommunities.length > 0 && <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">{joinedCommunities.length}</span>}</Tab>
            <Tab id="events">События</Tab>
          </TabList>

          <TabPanel id="feed">
            <div className="flex flex-col gap-4">
              <NewPostEditor onPublish={handlePublish} />
              <Separator className="bg-border" />
              {filteredPosts.length === 0 ? (
                <EmptyState className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-5xl">{activeHashtag || searchQuery ? '🔍' : '✍️'}</span>
                    <Text size="lg" className="font-semibold text-foreground">
                      {activeHashtag ? `Нет постов с ${activeHashtag}` : searchQuery ? 'Ничего не найдено' : 'Лента пуста'}
                    </Text>
                    <Text size="sm" variant="muted">
                      {activeHashtag || searchQuery ? 'Попробуйте другой запрос' : 'Будьте первым — напишите что-нибудь!'}
                    </Text>
                  </div>
                </EmptyState>
              ) : (
                filteredPosts.map(post => <PostCard key={post.id} post={post} {...CARD_PROPS} />)
              )}
            </div>
          </TabPanel>

          <TabPanel id="following">
            <div className="flex flex-col gap-4">
              {following.length === 0 ? (
                <div className="py-16 text-center">
                  <span className="text-5xl">👥</span>
                  <Text size="lg" className="mt-3 block font-semibold text-foreground">Нет подписок</Text>
                  <Text size="sm" variant="muted" className="mt-1 block">Подпишитесь на людей через поиск, чтобы видеть их посты здесь</Text>
                  <Button variant="primary" size="sm" className="mt-4" onPress={() => setSearchOpen(true)}>Найти людей</Button>
                </div>
              ) : filteredFollowingPosts.filter(p => following.includes(p.authorId)).length === 0 ? (
                <div className="py-16 text-center">
                  <span className="text-5xl">📭</span>
                  <Text size="sm" variant="muted" className="mt-3 block">Новых постов от подписок пока нет</Text>
                </div>
              ) : (
                filteredFollowingPosts.filter(p => following.includes(p.authorId)).map(post => (
                  <PostCard key={post.id} post={post} {...CARD_PROPS} />
                ))
              )}
            </div>
          </TabPanel>

          <TabPanel id="communities">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <Text size="sm" variant="muted">Ваши сообщества и каналы</Text>
                <Button variant="primary" size="sm" onPress={() => navigate('/communities')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-1" aria-hidden>
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Создать
                </Button>
              </div>

              {joinedCommunities.length === 0 ? (
                <div className="py-12 text-center">
                  <span className="text-5xl">🏛</span>
                  <Text size="lg" className="mt-3 block font-semibold text-foreground">Вы не в сообществах</Text>
                  <Text size="sm" variant="muted" className="mt-1 block">Вступите в класс, канал или создайте своё сообщество</Text>
                  <Button variant="primary" size="sm" className="mt-4" onPress={() => navigate('/communities')}>Найти сообщества</Button>
                </div>
              ) : (
                joinedCommunities.map(c => (
                  <button
                    key={c.id}
                    onClick={() => navigate(`/community/${c.id}`)}
                    className="flex items-center gap-4 rounded-2xl border border-border bg-surface-primary p-4 text-left transition-all hover:border-indigo-400/50 hover:shadow-sm"
                  >
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${c.cover} text-2xl shadow`}>
                      {c.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{c.name}</p>
                      <p className="mt-0.5 truncate text-xs text-muted">{c.description}</p>
                      <div className="mt-1.5 flex items-center gap-3">
                        <span className="text-xs text-muted">👥 {c.memberCount}</span>
                        <span className="rounded-full bg-surface-secondary px-2 py-0.5 text-[10px] font-medium text-muted">
                          {{ class: 'Класс', channel: 'Канал', community: 'Сообщество' }[c.type] ?? c.type}
                        </span>
                      </div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted" aria-hidden>
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                ))
              )}

              {joinedCommunities.length > 0 && (
                <Button variant="outline" size="sm" className="w-full" onPress={() => navigate('/communities')}>
                  Все сообщества
                </Button>
              )}
            </div>
          </TabPanel>

          <TabPanel id="events">
            <Surface variant="secondary" className="rounded-2xl p-8 text-center">
              <Text size="lg" className="font-semibold">📅 События</Text>
              <Text size="sm" variant="muted" className="mt-2">Школьные события появятся здесь</Text>
            </Surface>
          </TabPanel>
        </Tabs>

        <Text size="sm" className="mt-10 block text-center text-muted">
          SubreV © {new Date().getFullYear()} · Школа №1409
        </Text>
      </main>
    </div>
  );
}
