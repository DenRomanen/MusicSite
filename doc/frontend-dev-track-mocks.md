# Frontend Dev Track Mocks

Добавлены dev-only моковые данные для списка песен при запуске `npm run dev`.

- Создан отдельный слой моков `frontend/src/shared/mock/api/tracks.ts` с начальными треками, локальным in-memory состоянием и dev-реализациями `get/upload/delete`
- В `frontend/src/shared/api/tracks.ts` запросы треков переключаются на mock API только при `import.meta.env.DEV`
- Production-сборка и обычные API-запросы в build-режиме не изменены
- Дев-сервер теперь показывает список песен сразу после запуска, даже без backend с данными
