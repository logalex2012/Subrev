const KEY = 'subrev_communities';

let nextPostId = 100;

const INITIAL = [];

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
