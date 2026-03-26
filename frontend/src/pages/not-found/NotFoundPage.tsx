import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/Button'

export const NotFoundPage = () => (
  <section className="not-found-page">
    <div className="eyebrow">404</div>
    <h1>Страница не найдена</h1>
    <p>Запрошенный маршрут отсутствует. Вернитесь к библиотеке треков.</p>
    <Button aria-label="Вернуться на главную страницу" asChild type="button">
      <Link to="/">На главную</Link>
    </Button>
  </section>
)
