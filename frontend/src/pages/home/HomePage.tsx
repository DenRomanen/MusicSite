import { TrackLibrary } from '@/widgets/track-library/TrackLibrary'

export const HomePage = () => (
  <div className="page-stack home-page">
    <section className="hero-panel hero-panel--compact">
      {/* <div className="eyebrow">Коллекция</div> */}
      <h1 className="hero-panel__title">
        <span className="hero-panel__title-lead">Мои авторские песни</span>
        <span className="hero-panel__title-copy">
          Детские, о родных местах, близких мне людях, размышления о нашей
          жизни, серьёзно и с юмором.
        </span>
      </h1>
      {/* <p className="hero-panel__note">
        Слушайте каталог сразу на главной странице.
      </p> */}
    </section>
    <TrackLibrary />
  </div>
)
