# Desktop Player Width

Увеличена ширина встроенного плеера в desktop-версии списка треков.

- В `frontend/src/app/styles/index.css` базовая ширина `.track-list__player` увеличена с `168px` до `270px`, что примерно соответствует увеличению в 1.6 раза
- Tablet и mobile-правила не изменены: на `max-width: 980px` и `max-width: 720px` продолжают работать отдельные адаптивные ограничения ширины
