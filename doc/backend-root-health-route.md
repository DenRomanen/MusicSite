# Backend Root Health Route

Улучшено поведение backend после деплоя на Render при открытии базового URL сервиса в браузере.

- В `backend/src/app.ts` добавлен `GET /`, который возвращает JSON со статусом backend и подсказкой по доступным API-эндпоинтам
- В `backend/src/app.ts` добавлен `GET /health` для быстрого healthcheck сервиса
- В `README.md` уточнено, что корневой URL backend не является frontend-страницей и какие маршруты использовать для проверки API
