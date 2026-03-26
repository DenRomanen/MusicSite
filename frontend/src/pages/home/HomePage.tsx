import { TrackLibrary } from '@/widgets/track-library/TrackLibrary'

export const HomePage = () => (
  <div className="page-stack home-page">
    <section className="hero-panel hero-panel--compact">
      <div className="eyebrow">Коллекция</div>
      <h1>Современная музыкальная витрина с тихой классической интонацией</h1>
      <p>
        Слушайте каталог сразу на главной странице. После авторизации можно
        добавлять собственные произведения и управлять только своими загрузками.
      </p>
    </section>
    <TrackLibrary />
  </div>
)
