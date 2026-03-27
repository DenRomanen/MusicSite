# Render Admin Runtime Env

Уточнён сценарий деплоя backend на Render при обязательных runtime-переменных администратора.

- В `backend/src/config/env.ts` текст ошибки теперь явно разделяет локальный запуск и облачный деплой: локально нужен `backend/.env`, а на Render переменные должны быть заведены в окружении сервиса
- В `README.md` в секцию деплоя backend на Render добавлены обязательные `ADMIN_LOGIN` и `ADMIN_PASSWORD`
- В `README.md` добавлено прямое пояснение, что Render не читает локальный `backend/.env` из репозитория и ожидает все runtime env в настройках сервиса
