# Music Room

Fullstack музыкальный сайт в формате monorepo:

- `frontend/` — React + Vite + TypeScript, готовый к деплою на Netlify
- `backend/` — Node.js + Express + TypeScript, готовый к деплою на Render Free Web Service
- база данных — Supabase Postgres
- хранение аудио — Supabase Storage

## Что изменено для бесплатного деплоя

- SQLite полностью заменена на PostgreSQL через `pg`
- локальная папка `uploads/audio` больше не используется как основное хранилище
- загрузка аудио идет через `multer` в память и затем в Supabase Storage
- таблица `tracks` хранит `file_url`, `file_path`, `mime_type`, `size`
- backend слушает `process.env.PORT` и использует `FRONTEND_URL` для CORS
- frontend ходит в backend через `VITE_API_URL`
- для Netlify добавлен SPA rewrite через `frontend/public/_redirects`

## Структура проекта

```text
.
├─ backend/
│  ├─ sql/init.sql
│  ├─ src/
│  └─ .env.example
├─ frontend/
│  ├─ public/_redirects
│  ├─ src/
│  └─ .env.example
├─ doc/
└─ README.md
```

## Тестовый логин

- login берётся из `ADMIN_LOGIN`
- password берётся из `ADMIN_PASSWORD`

## Локальный запуск

1. Установите зависимости:

```bash
npm install
```

2. Скопируйте env-файлы:

```bash
Copy-Item backend/.env.example backend/.env
Copy-Item frontend/.env.example frontend/.env.local
```

3. Создайте проект в Supabase и заполните `backend/.env`:

```env
PORT=10000
ADMIN_LOGIN=replace-admin-login
ADMIN_PASSWORD=replace-admin-password
DATABASE_URL=postgresql://postgres.your-project:<db-password>@aws-0-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require
JWT_SECRET=replace-with-a-long-random-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_BUCKET=audio
FRONTEND_URL=http://localhost:5173
```

4. Заполните `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:10000
```

5. Создайте bucket в Supabase Storage:

- откройте `Storage`
- создайте bucket `audio`
- сделайте bucket public, потому что backend сохраняет public URL для плеера

6. Примените SQL схему:

- откройте `Supabase Dashboard -> SQL Editor`
- вставьте содержимое [backend/sql/init.sql](/d:/MusicSite/backend/sql/init.sql)
- выполните запрос

7. Запустите seed администратора:

```bash
npm run seed --workspace backend
```

Скрипт создаст администратора со значениями из `ADMIN_LOGIN` и `ADMIN_PASSWORD`.

8. Запустите приложения локально:

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

Frontend будет доступен на `http://localhost:5173`, backend на `http://localhost:10000`.

## Supabase

### 1. Создание проекта

- создайте новый проект в Supabase
- дождитесь завершения инициализации
- сохраните `Project URL`, `Service Role Key` и строку подключения Postgres

### 2. Postgres

- используйте `DATABASE_URL` от Supabase Postgres
- для внешнего подключения добавьте `?sslmode=require`, если его нет
- backend сам читает эту строку через пакет `pg`

### 3. Storage

- bucket должен называться `audio` или используйте другое имя через `SUPABASE_BUCKET`
- backend загружает файл, получает public URL и сохраняет его в `tracks.file_url`
- при удалении трека backend удаляет запись из Postgres и файл из bucket

## SQL / migration

Минимальная схема лежит в [backend/sql/init.sql](/d:/MusicSite/backend/sql/init.sql).

Создаются таблицы:

- `users(id, login, password_hash, created_at)`
- `tracks(id, title, artist, file_url, file_path, mime_type, size, uploaded_by, created_at)`

## Backend API

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/tracks`
- `POST /api/tracks`
- `DELETE /api/tracks/:id`

Правила доступа:

- `GET /api/tracks` доступен всем
- `POST /api/tracks` доступен только авторизованному пользователю
- `DELETE /api/tracks/:id` доступен только авторизованному пользователю и только для собственных треков

Поддерживаемые форматы:

- `mp3`
- `wav`
- `ogg`

## Деплой backend на Render

Рекомендуемая настройка сервиса:

- Service Type: `Web Service`
- Runtime: `Node`
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm start`

Env-переменные для Render:

- `PORT=10000`
- `ADMIN_LOGIN=<admin login>`
- `ADMIN_PASSWORD=<admin password>`
- `DATABASE_URL=<Supabase Postgres connection string>`
- `JWT_SECRET=<long random secret>`
- `SUPABASE_URL=<Supabase project URL>`
- `SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>`
- `SUPABASE_BUCKET=audio`
- `FRONTEND_URL=<Netlify site URL>`

Render не использует ваш локальный `backend/.env`, поэтому все runtime-переменные из списка выше нужно добавить в `Environment` у сервиса вручную.

После деплоя получите backend URL вида:

```text
https://your-backend-name.onrender.com
```

## Деплой frontend на Netlify

Рекомендуемая настройка сайта:

- Base directory: `frontend`
- Build command: `npm run build`
- Publish directory: `dist`

Env-переменная для Netlify:

- `VITE_API_URL=https://your-backend-name.onrender.com`

On Netlify, set `VITE_API_URL` in `Site configuration -> Environment variables`. This value is available at build time and becomes part of the frontend bundle, so sensitive values should not be committed to the repository.

В проект уже добавлен файл `frontend/public/_redirects`:

```text
/* /index.html 200
```

Это нужно, чтобы:

- прямой переход на `/login` корректно открывал SPA
- несуществующие маршруты React Router не ломали приложение на Netlify

## Как связать frontend и backend после деплоя

1. Задеплойте backend на Render и сохраните его публичный URL
2. Вставьте этот URL в `VITE_API_URL` на Netlify
3. Возьмите публичный URL Netlify и вставьте его в `FRONTEND_URL` на Render
4. Перезапустите оба деплоя, если env были изменены после первой публикации

## Скрипты

Корень monorepo:

```bash
npm run build
npm run lint
npm run test -- --run
```

Backend:

```bash
npm run dev --workspace backend
npm run build --workspace backend
npm run start --workspace backend
npm run seed --workspace backend
```

Frontend:

```bash
npm run dev --workspace frontend
npm run build --workspace frontend
npm run preview --workspace frontend
```

## Итоговый запуск

Локально:

```bash
npm install
npm run seed --workspace backend
npm run dev --workspace backend
npm run dev --workspace frontend
```

Проверка качества:

```bash
npm run build
npm run lint
npm run test -- --run
```
