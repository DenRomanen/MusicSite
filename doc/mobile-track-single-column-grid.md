# Mobile Track Single Column Grid

Исправлена мобильная сетка строки списка треков.

- В `frontend/src/app/styles/index.css` для breakpoint `max-width: 720px` добавлено явное переопределение `grid-template-columns: minmax(0, 1fr)` для `.track-list--with-actions .track-list__row` и `.track-list:not(.track-list--with-actions) .track-list__row`
- Это перебивает более специфичные tablet/desktop-правила и переносит плеер под название на мобильных устройствах
- Скрытие исполнителя и даты на mobile сохранено
