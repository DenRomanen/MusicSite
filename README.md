# Music Room

Минималистичный fullstack-сайт для прослушивания музыкальных произведений с публичным каталогом, авторизацией администратора и загрузкой аудиофайлов.

## Стек

- frontend: React + Vite + TypeScript + React Router + Redux Toolkit + Formik + Yup + Sonner
- backend: Node.js + Express + TypeScript + JWT + multer
- database: SQLite через встроенный модуль `node:sqlite`

## Возможности

- публичная главная страница `/` со списком треков и встроенным audio player
- страница входа `/login` без регистрации
- frontend 404 и backend 404
- seed-пользователь `musicadmin / MusicAdmin2026!`
- загрузка `mp3`, `wav`, `ogg` только после авторизации
- удаление только собственных треков
- хранение файлов в `uploads/audio`

## Переменные окружения

Скопируйте значения из [`.env.example`](/d:/MusicSite/.env.example):

1. backend-переменные в `backend/.env`
2. frontend-переменные в `frontend/.env.local`

## Установка и запуск

```bash
npm install
npm run seed --workspace backend
npm run dev --workspace backend
npm run dev --workspace frontend
```

Frontend по умолчанию доступен на `http://localhost:5173`, backend на `http://localhost:4000`.

## Полезные команды

```bash
npm run build
npm run lint
npm run test -- --run
```

## API

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tracks`
- `POST /api/tracks`
- `DELETE /api/tracks/:id`
