const KEY = 'subrev_communities';

let nextPostId = 100;

const INITIAL = [
  {
    id: '9a',
    name: '9А класс',
    emoji: '🏫',
    cover: 'from-sky-500 to-indigo-600',
    description: 'Официальный чат класса 9А школы №1409. Объявления, домашние задания, общение.',
    type: 'class',
    memberCount: 28,
    createdAt: '01.09.2025',
    joined: true,
    posts: [
      { id: 10, author: 'Мария Петрова', initials: 'МП', avatar: null, text: 'Не забудьте! Завтра контрольная по математике 📚 #математика', time: '1 ч назад', reactions: { '❤️': 5, '😮': 2 }, myReaction: null, comments: [] },
      { id: 11, author: 'Алексей Логинов', initials: 'АЛ', avatar: '/EBB6A530-824E-42D8-B995-E0FD09DCEC5A.jpeg', text: 'Всем привет! Кто идёт на тренировку после уроков? #спорт', time: '3 ч назад', reactions: { '👏': 4, '❤️': 1 }, myReaction: null, comments: [] },
    ],
    members: [
      { id: 'loginov', name: 'Алексей Логинов', initials: 'АЛ', avatar: '/EBB6A530-824E-42D8-B995-E0FD09DCEC5A.jpeg', role: 'Ученик' },
      { id: 'teacher1', name: 'Мария Петрова', initials: 'МП', avatar: null, role: 'Учитель' },
      { id: 'student1', name: 'Иван Смирнов', initials: 'ИС', avatar: null, role: 'Ученик' },
      { id: 'student2', name: 'Анна Козлова', initials: 'АК', avatar: null, role: 'Ученик' },
    ],
  },
  {
    id: 'newspaper',
    name: 'Школьная газета',
    emoji: '📰',
    cover: 'from-amber-500 to-orange-600',
    description: 'Новости, события и репортажи школы №1409. Все самое интересное — здесь.',
    type: 'channel',
    memberCount: 145,
    createdAt: '15.09.2025',
    joined: false,
    posts: [
      { id: 20, author: 'Редакция', initials: 'РД', avatar: null, text: '🏆 Поздравляем команду школы с победой на городской олимпиаде по физике! #олимпиада #победа', time: '2 ч назад', reactions: { '❤️': 34, '👏': 28 }, myReaction: null, comments: [] },
    ],
    members: [
      { id: 'editor', name: 'Редакция', initials: 'РД', avatar: null, role: 'Редактор' },
    ],
  },
  {
    id: 'coding',
    name: 'Кружок программирования',
    emoji: '💻',
    cover: 'from-emerald-500 to-teal-600',
    description: 'Учимся программировать вместе! Python, JavaScript, алгоритмы. Для всех уровней.',
    type: 'community',
    memberCount: 12,
    createdAt: '01.10.2025',
    joined: false,
    posts: [
      { id: 30, author: 'Алексей Логинов', initials: 'АЛ', avatar: '/EBB6A530-824E-42D8-B995-E0FD09DCEC5A.jpeg', text: 'Сегодня разобрали рекурсию на Python. Кто не был — вот конспект: #python #алгоритмы', time: 'вчера', reactions: { '❤️': 6, '👏': 3 }, myReaction: null, comments: [] },
    ],
    members: [
      { id: 'loginov', name: 'Алексей Логинов', initials: 'АЛ', avatar: '/EBB6A530-824E-42D8-B995-E0FD09DCEC5A.jpeg', role: 'Организатор' },
    ],
  },
];

export function getCommunities() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(INITIAL));
  } catch {
    return JSON.parse(JSON.stringify(INITIAL));
  }
}

function persist(communities) {
  localStorage.setItem(KEY, JSON.stringify(communities));
  window.dispatchEvent(new CustomEvent('communities:change'));
}

export function getCommunity(id) {
  return getCommunities().find(c => c.id === id) ?? null;
}

export function joinCommunity(id) {
  const all = getCommunities();
  persist(all.map(c => c.id === id ? { ...c, joined: true, memberCount: c.memberCount + 1 } : c));
}

export function leaveCommunity(id) {
  const all = getCommunities();
  persist(all.map(c => c.id === id ? { ...c, joined: false, memberCount: Math.max(0, c.memberCount - 1) } : c));
}

export function createCommunity({ name, emoji, description, type }) {
  const all = getCommunities();
  const id = name.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '').slice(0, 20) + '-' + Date.now();
  const newCommunity = {
    id,
    name,
    emoji: emoji || '💬',
    cover: 'from-indigo-500 to-violet-600',
    description,
    type,
    memberCount: 1,
    createdAt: new Date().toLocaleDateString('ru-RU'),
    joined: true,
    posts: [],
    members: [],
  };
  persist([newCommunity, ...all]);
  return newCommunity;
}

export function addPostToCommunity(communityId, post) {
  const all = getCommunities();
  persist(all.map(c =>
    c.id === communityId
      ? { ...c, posts: [{ ...post, id: nextPostId++ }, ...c.posts] }
      : c
  ));
}

export function reactInCommunityPost(communityId, postId, emoji) {
  const all = getCommunities();
  persist(all.map(c => {
    if (c.id !== communityId) return c;
    return {
      ...c,
      posts: c.posts.map(p => {
        if (p.id !== postId) return p;
        const reactions = { ...p.reactions };
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
      }),
    };
  }));
}
