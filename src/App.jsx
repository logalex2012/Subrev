import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChangelog } from './changelog.js';
import {
  Button,
  Description,
  Input,
  Label,
  Link,
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
  Text,
  TextField,
} from '@heroui/react';
import { ThemeToggle } from './ThemeToggle.jsx';

const footerLinks = [
  { href: '#', label: 'О проекте' },
  { href: '#', label: 'Правила' },
  { href: '#', label: 'Конфиденциальность' },
  { href: '#', label: 'Поддержка' },
];


function BrandPanel() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden px-8 py-8 lg:h-full lg:px-14 lg:py-16">
      {/* Gradient blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-rose-500"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 -top-32 size-[480px] rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-24 size-[360px] rounded-full bg-rose-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-24 left-0 size-[280px] rounded-full bg-violet-400/20 blur-3xl"
      />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <img src="/icon1ej.png" alt="SubreV" className="size-9 rounded-xl" />
        <span className="font-display text-xl font-bold tracking-tight text-white">
          SubreV
        </span>
      </div>

      {/* Main copy — hidden on mobile, shown on lg+ */}
      <div className="relative z-10 hidden flex-col lg:flex">
        <h1 className="font-display text-[clamp(2rem,3.5vw,3.25rem)] font-bold leading-[1.1] tracking-[-0.035em] text-white">
          Школьная<br />
          <span className="text-white/70">соцсеть №1409</span>
        </h1>
        <p className="mt-6 max-w-sm text-base leading-relaxed text-white/70">
          SubreV — это своя соцсеть для учеников и учителей школы №1409. Общайтесь, делитесь, следите за жизнью школы.
        </p>

        <ul className="mt-10 space-y-4">
          {[
            { icon: '💬', text: 'Посты, комментарии и реакции — как в привычных лентах' },
            { icon: '🏫', text: 'Только школьное сообщество — никаких посторонних' },
            { icon: '📱', text: 'Работает на любом устройстве, всегда под рукой' },
          ].map(({ icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-white/15 text-sm">
                {icon}
              </span>
              <span className="text-sm leading-snug text-white/80">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom tagline */}
      <div className="relative z-10 mt-6 lg:mt-0">
        <p className="text-xs text-white/45">Школа №1409 · Москва</p>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [touched, setTouched] = useState(false);
  const [changelog, setChangelog] = useState(getChangelog);

  useEffect(() => {
    function sync() { setChangelog(getChangelog()); }
    window.addEventListener('changelog:change', sync);
    return () => window.removeEventListener('changelog:change', sync);
  }, []);

  const isEmpty = login.trim() === '';
  const showError = touched && isEmpty;

  function handleSubmit() {
    setTouched(true);
    if (!isEmpty) navigate('/feed');
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50 text-foreground dark:bg-[oklch(12%_0.005_285.823)] lg:flex-row">

      {/* ─── Left brand panel ─── */}
      <div className="w-full lg:sticky lg:top-0 lg:h-screen lg:w-5/12 xl:w-[45%]">
        <BrandPanel />
      </div>

      {/* ─── Right form panel ─── */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex items-center justify-between gap-4 px-6 py-4 sm:px-10">
          <span className="text-sm text-slate-500 dark:text-white/40">
            Ещё нет логина?{' '}
            <Link href="#" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
              Получить у администратора
            </Link>
          </span>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="hidden text-slate-600 hover:bg-slate-100 dark:text-white/70 dark:hover:bg-white/10 sm:inline-flex"
            >
              Справка
            </Button>

            {/* Новости / changelog */}
            <Modal>
              <ModalTrigger>
                <Button
                  variant="secondary"
                  size="sm"
                  className="relative border border-slate-300/90 bg-white/80 text-slate-800 backdrop-blur-sm hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  Новости
                  <span className="absolute -right-1 -top-1 flex size-2.5 items-center justify-center rounded-full bg-indigo-500 ring-2 ring-white dark:ring-[oklch(12%_0.005_285.823)]" />
                </Button>
              </ModalTrigger>
              <ModalBackdrop>
                <ModalContainer size="md">
                  <ModalDialog>
                    <ModalHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg">
                          🚀
                        </div>
                        <div>
                          <ModalHeading className="text-lg font-bold tracking-tight">
                            Обновления SubreV
                          </ModalHeading>
                          <p className="text-xs text-muted">Что нового в приложении</p>
                        </div>
                      </div>
                      <ModalCloseTrigger />
                    </ModalHeader>
                    <ModalBody className="space-y-5">
                      {changelog.map(release => (
                        <div key={release.version}>
                          <div className="mb-3 flex items-center gap-2.5">
                            <span className="font-display text-base font-bold tracking-tight text-foreground">
                              {release.version}
                            </span>
                            {release.badge && (
                              <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                                {release.badge}
                              </span>
                            )}
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
                      <div className="rounded-xl border border-border bg-surface-secondary px-4 py-3 text-xs text-muted">
                        SubreV активно развивается. Следи за обновлениями!
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="primary" fullWidth slot="close">
                        Отлично!
                      </Button>
                    </ModalFooter>
                  </ModalDialog>
                </ModalContainer>
              </ModalBackdrop>
            </Modal>

            <Modal>
              <ModalTrigger>
                <Button
                  variant="secondary"
                  size="sm"
                  className="border border-slate-300/90 bg-white/80 text-slate-800 backdrop-blur-sm hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  О проекте
                </Button>
              </ModalTrigger>
              <ModalBackdrop>
                <ModalContainer size="sm">
                  <ModalDialog>
                    <ModalHeader>
                      <div className="flex items-center gap-3">
                        <img
                          src="/icon1ej.png"
                          alt="SubreV"
                          className="size-10 rounded-2xl"
                        />
                        <div>
                          <ModalHeading className="text-lg font-bold tracking-tight">
                            SubreV
                          </ModalHeading>
                          <p className="text-xs text-muted">Школьная соцсеть</p>
                        </div>
                      </div>
                      <ModalCloseTrigger />
                    </ModalHeader>
                    <ModalBody className="space-y-4">
                      <p className="text-sm leading-relaxed text-foreground/80">
                        SubreV — школьная социальная сеть, созданная специально
                        для учеников и учителей школы <strong>№&thinsp;1409</strong>.
                        Общение, новости класса и школьной жизни — всё в одном месте.
                      </p>
                      <div className="rounded-xl border border-border bg-surface-secondary p-4">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted">
                          Автор
                        </p>
                        <div className="flex items-center gap-3">
                          <img
                            src="/EBB6A530-824E-42D8-B995-E0FD09DCEC5A.jpeg"
                            alt="Алексей Логинов"
                            className="size-9 shrink-0 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-semibold text-foreground">
                              Алексей Логинов
                            </p>
                            <p className="text-xs text-muted">Школа №1409 · Москва</p>
                          </div>
                        </div>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button variant="primary" fullWidth slot="close">
                        Понятно
                      </Button>
                    </ModalFooter>
                  </ModalDialog>
                </ModalContainer>
              </ModalBackdrop>
            </Modal>
          </div>
        </header>

        {/* Form area */}
        <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16 pt-8 sm:px-10">
          <div className="w-full max-w-sm">
            {/* Mobile logo (hidden on lg) */}
            <div className="mb-8 flex items-center gap-2.5 lg:hidden">
              <img src="/icon1ej.png" alt="SubreV" className="size-9 rounded-xl" />
              <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                SubreV
              </span>
            </div>

            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Добро пожаловать
            </h2>
            <p className="mt-1.5 text-sm text-slate-500 dark:text-white/50">
              Введите свой школьный логин для входа
            </p>

            <form
              className="mt-8 flex flex-col gap-5"
              onSubmit={e => { e.preventDefault(); handleSubmit(); }}
            >
              <TextField
                fullWidth
                name="login"
                autoComplete="username"
                value={login}
                onChange={setLogin}
                isInvalid={showError}
              >
                <Label className="font-medium">Логин</Label>
                <Input placeholder="Например, ivanov" />
                {showError ? (
                  <Description className="text-danger">
                    Введите логин, чтобы продолжить
                  </Description>
                ) : (
                  <Description>
                    Тот же идентификатор, что и для школьных сервисов
                  </Description>
                )}
              </TextField>

              <Button
                type="submit"
                fullWidth
                size="lg"
                variant="primary"
              >
                Продолжить
              </Button>
            </form>

            <Separator className="my-7 bg-slate-200 dark:bg-white/10" />

            <div className="flex flex-col gap-3">
              <Button
                type="button"
                fullWidth
                variant="outline"
                className="justify-center gap-2 border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-white/15 dark:bg-white/5 dark:text-white/80 dark:hover:bg-white/10"
              >
                <img src="/favicon.png" alt="" aria-hidden className="size-5 rounded-md" />
                Войти с 1409ID
              </Button>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 px-6 py-5 dark:border-white/8 sm:px-10">
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
            {footerLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="text-slate-400 transition-colors hover:text-slate-600 dark:text-white/35 dark:hover:text-white/70"
              >
                {label}
              </Link>
            ))}
          </nav>
          <Text
            size="xs"
            className="mt-3 block text-center text-slate-400 dark:text-white/30"
          >
            © {new Date().getFullYear()} SubreV · Школа №1409
          </Text>
        </footer>
      </div>
    </div>
  );
}

export default App;
