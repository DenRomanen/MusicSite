# Frontend API Env Netlify

Frontend переведен на обязательное использование `VITE_API_URL` без хардкод-фолбэка.

- В `frontend/src/shared/config/env.ts` адрес API теперь читается напрямую из `import.meta.env.VITE_API_URL`
- Если `VITE_API_URL` не задан, frontend завершает инициализацию с явной ошибкой конфигурации вместо скрытого запроса в `http://localhost:10000`
- В `README.md` добавлено уточнение, что для Netlify `VITE_API_URL` лучше задавать через UI в `Site configuration -> Environment variables`
