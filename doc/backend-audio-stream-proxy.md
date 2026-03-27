# Backend Audio Stream Proxy

Исправлено воспроизведение музыки через backend, чтобы браузер больше не запрашивал mp3 напрямую из Supabase Storage.

- В `backend/src/routes/trackRoutes.ts` добавлен маршрут `GET /api/tracks/:id/stream`, который проксирует аудиопоток из Supabase Storage и поддерживает `Range` для встроенного HTML-аудиоплеера
- В `backend/src/services/trackService.ts` поле `audioUrl` в ответе API теперь указывает на backend-маршрут стриминга, а не на прямую signed-ссылку Supabase
- В `backend/src/app.ts` включен `trust proxy`, чтобы backend на Render корректно собирал внешний `https`-адрес для `audioUrl`
