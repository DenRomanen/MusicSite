import '@/app/styles/index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root container "#root" was not found')
}

const root = createRoot(rootElement)

const renderBootstrapError = (error: unknown) => {
  const message =
    error instanceof Error
      ? error.message
      : 'Приложение не удалось инициализировать'

  root.render(
    <div className="bootstrap-error" role="alert">
      <div className="bootstrap-error__panel">
        <span className="bootstrap-error__eyebrow">Ошибка запуска</span>
        <h1>Фронтенд не смог инициализироваться</h1>
        <p>{message}</p>
      </div>
    </div>,
  )
}

void import('@/app/App')
  .then(({ App }) => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    )
  })
  .catch(renderBootstrapError)
