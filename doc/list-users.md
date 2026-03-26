# List Users

Добавлен npm-скрипт для просмотра пользователей из SQLite-базы проекта.

- В `backend/src/scripts/listUsers.ts` добавлен скрипт, который читает таблицу `users` и выводит `id`, `login`, `created_at`
- В `backend/package.json` добавлен скрипт `users:list`
- В корневой `package.json` добавлен алиас `users:list`, чтобы запускать просмотр пользователей из корня проекта

Запуск:

```bash
npm run users:list
```
