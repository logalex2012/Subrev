# SubreV SDK (`@subrev/sdk`)

SDK для интеграций с SubreV: **авторизация**, **боты**, **стикеры**, и расширяемая архитектура под “и многое другое”.

> В этом репозитории пока нет серверного API, поэтому SDK описывает **контракт** (эндпоинты/форматы), а вы можете реализовать его на сервере или прокинуть адаптер.

## Установка (локально в этом репо)

Внутри этого репозитория пакет уже лежит в папке `SDK/`.

Если хотите импортировать его из фронтенда этого же репо — проще всего использовать относительный импорт:

```js
import { SubrevClient, createWebTokenStorage } from '../SDK/src/index.js';
```

Когда будете выносить в отдельный npm‑пакет — достаточно сделать `public` и опубликовать.

## Быстрый старт

```js
import { SubrevClient, createWebTokenStorage } from '../SDK/src/index.js';

const client = new SubrevClient({
  baseUrl: 'https://your-project.vercel.app',
  tokenStorage: createWebTokenStorage(),
  // В браузере можно включить очередь "записей" при офлайне:
  queueWritesWhenOffline: true,
});

// 1) Логин (пример контракта)
const { token, user } = await client.auth.loginWithPassword({
  login: 'ivanov',
  password: 'secret',
});

// 2) Создать стикерпак
const pack = await client.stickers.createPack({
  title: 'Мой пак',
  description: 'Стикеры для бота',
  isPublic: false,
});

// 3) Загрузить стикер
const file = document.querySelector('input[type=file]').files[0];
await client.stickers.uploadSticker({
  packId: pack.id,
  file,
  emoji: '🔥',
  title: 'fire',
});
```

## Концепция: “нет интернета” vs “сервер упал”

- **Нет интернета**: браузер `navigator.onLine === false`.  
  В этом режиме SDK может **ставить non‑GET запросы в очередь** (если включить `queueWritesWhenOffline`).

- **Сервер упал / не отвечает**: интернет есть, но запросы падают (5xx, таймауты, network error).  
  SDK кидает `HTTPError`/`TimeoutError`/`NetworkError` — это удобно маппить на вашу страницу `/500` или `/offline`.

## API контракты (предложение)

SDK сейчас ожидает такие эндпоинты (можно поменять в коде SDK под ваш бекенд):

### Auth
- `POST /api/auth/login` → `{ token, user }`
- `GET  /api/auth/me` → `user`

### Stickers
- `GET  /api/stickers/packs` → `pack[]`
- `POST /api/stickers/packs` → `pack`
- `POST /api/stickers/packs/:packId/stickers` (multipart) → `sticker`

### Bots
- `GET  /api/bots` → `bot[]`
- `POST /api/bots` → `bot`
- `POST /api/bots/:botId/token:rotate` → `{ token }`
- `POST /api/bots/:botId/chats/:chatId/messages` → `message`

## Ошибки

SDK бросает:
- `HTTPError` (есть `status`, `body`, `requestId`)
- `TimeoutError`
- `NetworkError`

Пример обработки:

```js
import { HTTPError, NetworkError, TimeoutError } from '../SDK/src/index.js';

try {
  await client.stickers.listPacks();
} catch (e) {
  if (e instanceof NetworkError) {
    // похоже, офлайн
  } else if (e instanceof TimeoutError) {
    // сервер долго отвечает
  } else if (e instanceof HTTPError && e.status >= 500) {
    // сервер упал
  }
}
```

## Расширение SDK (“и многое другое”)

SDK поддерживает расширения:

```js
client.use('marketplace', (c) => ({
  listApps: async () => (await c.request({ path: 'api/apps', method: 'GET' })).data,
}));

const apps = await client.marketplace.listApps();
```

## Рекомендация по безопасности

- Давайте ботам **scopes/permissions** и проверяйте их на сервере.
- Токены храните как можно безопаснее (в вебе — лучше httpOnly cookies; localStorage проще, но менее безопасно).

