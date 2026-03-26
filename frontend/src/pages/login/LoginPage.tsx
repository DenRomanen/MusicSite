import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { useAppSelector } from '@/shared/hooks/redux'

export const LoginPage = () => {
  const { user } = useAppSelector((state) => state.auth)

  if (user) {
    return <Navigate replace to="/" />
  }

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <div className="eyebrow">Вход</div>
        <h1>Только для администратора</h1>
        <p>Регистрация отключена.</p>

        <LoginForm />
      </div>
    </section>
  )
}
