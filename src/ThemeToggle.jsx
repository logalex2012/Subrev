import { Button, useTheme } from '@heroui/react';
import { useEffect, useState } from 'react';

function SunIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme('dark');
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const sync = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => obs.disconnect();
  }, [theme]);

  useEffect(() => {
    const meta = document.getElementById('theme-color-meta');
    if (meta) meta.setAttribute('content', isDark ? '#0a0a0b' : '#e8e8ed');
  }, [isDark]);

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      isIconOnly
      aria-label={isDark ? 'Светлая тема' : 'Тёмная тема'}
      title={isDark ? 'Светлая тема' : 'Тёмная тема'}
      className="shrink-0 border border-slate-300/80 bg-white/90 text-slate-800 shadow-sm backdrop-blur-sm hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
      onPress={() => {
        setTheme(isDark ? 'light' : 'dark');
      }}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
