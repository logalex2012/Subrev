import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Text } from '@heroui/react';
import { ThemeToggle } from '../ThemeToggle.jsx';
import { getProfile } from '../userStore.js';

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    userId: 'teacher1',
    name: 'Мария Петрова',
    initials: 'МП',
    avatar: null,
    role: 'Учитель',
    lastMsg: 'Не забудьте сдать работы до пятницы',
    lastTime: '10:42',
    unread: 2,
    messages: [
      { id: 1, from: 'teacher1', text: 'Добрый день!', time: '10:30' },
      { id: 2, from: 'me', text: 'Здравствуйте!', time: '10:35' },
      { id: 3, from: 'teacher1', text: 'Не забудьте сдать работы до пятницы', time: '10:42' },
    ],
  },
  {
    id: 2,
    userId: 'student1',
    name: 'Иван Смирнов',
    initials: 'ИС',
    avatar: null,
    role: 'Ученик 9А',
    lastMsg: 'Идёшь завтра на тренировку?',
    lastTime: 'вчера',
    unread: 0,
    messages: [
      { id: 1, from: 'student1', text: 'Привет!', time: '15:00' },
      { id: 2, from: 'me', text: 'Привет)', time: '15:05' },
      { id: 3, from: 'student1', text: 'Идёшь завтра на тренировку?', time: '15:10' },
    ],
  },
  {
    id: 3,
    userId: 'student2',
    name: 'Анна Козлова',
    initials: 'АК',
    avatar: null,
    role: 'Ученик 9А',
    lastMsg: 'Спасибо за помощь!',
    lastTime: 'пн',
    unread: 0,
    messages: [
      { id: 1, from: 'me', text: 'Привет, как дела?', time: '14:00' },
      { id: 2, from: 'student2', text: 'Отлично, спасибо!', time: '14:20' },
      { id: 3, from: 'student2', text: 'Спасибо за помощь!', time: '14:21' },
    ],
  },
];

function Avatar({ initials, src, size = 'md' }) {
  const sz = size === 'sm' ? 'size-8 text-xs' : size === 'lg' ? 'size-12 text-base' : 'size-10 text-sm';
  return (
    <div className={`${sz} shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 font-bold text-white flex items-center justify-center`}>
      {src ? <img src={src} alt={initials} className="h-full w-full object-cover" /> : initials}
    </div>
  );
}

export default function Messages() {
  const navigate = useNavigate();
  const me = getProfile();
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeId, setActiveId] = useState(null);
  const [input, setInput] = useState('');
  const [mobileView, setMobileView] = useState('list');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const active = conversations.find(c => c.id === activeId);

  function openConversation(id) {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
    setActiveId(id);
    setMobileView('chat');
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  function sendMessage() {
    if (!input.trim() || !active) return;
    const msg = { id: Date.now(), from: 'me', text: input.trim(), time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) };
    setConversations(prev => prev.map(c =>
      c.id === activeId
        ? { ...c, messages: [...c.messages, msg], lastMsg: msg.text, lastTime: msg.time }
        : c
    ));
    setInput('');
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages.length]);

  const totalUnread = conversations.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-5 backdrop-blur-md sm:px-8">
        <Button isIconOnly variant="ghost" size="sm" onPress={() => mobileView === 'chat' ? setMobileView('list') : navigate('/feed')} aria-label="Назад">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </Button>
        <span className="font-display font-bold tracking-tight text-foreground">
          {mobileView === 'chat' && active ? active.name : 'Сообщения'}
        </span>
        {totalUnread > 0 && mobileView !== 'chat' && (
          <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-bold text-white">{totalUnread}</span>
        )}
        <div className="ml-auto"><ThemeToggle /></div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversation list */}
        <aside className={`flex w-full flex-col border-r border-border sm:w-72 sm:shrink-0 ${mobileView === 'chat' ? 'hidden sm:flex' : 'flex'}`}>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => openConversation(conv.id)}
                className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface-secondary ${activeId === conv.id ? 'bg-surface-secondary' : ''}`}
              >
                <div className="relative">
                  <Avatar initials={conv.initials} src={conv.avatar} />
                  {conv.unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white">{conv.unread}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <p className="truncate text-sm font-semibold text-foreground">{conv.name}</p>
                    <span className="shrink-0 text-[11px] text-muted">{conv.lastTime}</span>
                  </div>
                  <p className={`truncate text-xs ${conv.unread > 0 ? 'font-medium text-foreground/80' : 'text-muted'}`}>{conv.lastMsg}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat panel */}
        <div className={`flex flex-1 flex-col ${mobileView === 'list' ? 'hidden sm:flex' : 'flex'}`}>
          {!active ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
              <span className="text-5xl">💬</span>
              <Text size="lg" className="font-semibold text-foreground">Выберите диалог</Text>
              <Text size="sm" variant="muted">Нажмите на беседу слева, чтобы открыть её</Text>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="hidden items-center gap-3 border-b border-border px-5 py-3 sm:flex">
                <Avatar initials={active.initials} src={active.avatar} size="md" />
                <div>
                  <p className="font-semibold text-foreground">{active.name}</p>
                  <p className="text-xs text-muted">{active.role}</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
                <div className="flex flex-col gap-2">
                  {active.messages.map(msg => {
                    const isMe = msg.from === 'me';
                    return (
                      <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                        {!isMe && <Avatar initials={active.initials} src={active.avatar} size="sm" />}
                        <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isMe ? 'rounded-br-sm bg-indigo-600 text-white' : 'rounded-bl-sm bg-surface-secondary text-foreground'}`}>
                          <p className="text-sm leading-snug">{msg.text}</p>
                          <p className={`mt-0.5 text-[10px] ${isMe ? 'text-white/60' : 'text-muted'}`}>{msg.time}</p>
                        </div>
                        {isMe && (
                          <div className="size-8 shrink-0 overflow-hidden rounded-full">
                            {me.avatar ? <img src={me.avatar} alt={me.initials} className="h-full w-full object-cover" /> : (
                              <div className="flex size-full items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-xs font-bold text-white">{me.initials}</div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Input */}
              <div className="shrink-0 border-t border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-6">
                <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex items-end gap-2">
                  <div className="flex-1 rounded-2xl border border-border bg-surface-secondary px-4 py-2.5">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                      placeholder="Написать сообщение…"
                      rows={1}
                      className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none"
                    />
                  </div>
                  <Button type="submit" variant="primary" size="sm" isIconOnly isDisabled={!input.trim()} aria-label="Отправить">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
