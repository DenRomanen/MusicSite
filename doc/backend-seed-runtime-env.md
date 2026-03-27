# Backend Seed Runtime Env

Уточнено поведение backend CLI-скриптов при отсутствии локального env-файла.

- В `backend/src/config/env.ts` добавлена общая проверка `assertRequiredRuntimeEnv` для обязательных runtime-переменных
- В `backend/src/server.ts`, `backend/src/scripts/seedAdmin.ts` и `backend/src/scripts/listUsers.ts` backend-скрипты теперь завершаются с явной инструкцией скопировать `backend/.env.example` в `backend/.env`
- Это устраняет неинформативное падение `seed` глубоко в `database.ts` и делает причину ошибки видимой сразу при запуске скрипта
- В `backend/.env.example` исправлена строка `DATABASE_URL`: вместо direct IPv6-only host `db...supabase.co:5432` теперь используется Supabase session pooler `aws-0-eu-central-1.pooler.supabase.com:5432` с `sslmode=require`, который подходит для обычного backend-сервера по IPv4
- В `backend/src/db/database.ts` для Supabase-подключений добавлен `ssl: { rejectUnauthorized: false }`, чтобы `pg` корректно подключался к pooler и не падал на `SELF_SIGNED_CERT_IN_CHAIN`
