import { Link, Outlet, useLocation } from 'react-router-dom'
import { toast } from 'sonner'
import { clearSession } from '@/features/auth/model/authSlice'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { cn } from '@/shared/lib/cn'
import { removeStoredAccessToken } from '@/shared/lib/storage'
import { Button } from '@/shared/ui/Button'

export const MainLayout = () => {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { isBootstrapping, user } = useAppSelector((state) => state.auth)
  const isHomePage = location.pathname === '/'

  const handleLogout = () => {
    removeStoredAccessToken()
    dispatch(clearSession())
    toast.success('Сессия завершена')
  }

  return (
    <div className={cn('page-shell', isHomePage && 'page-shell--home')}>
      <header className="site-header">
        <Link
          aria-label="Перейти на главную страницу"
          className="brand-mark"
          to="/"
        >
          Music Room
        </Link>
        <div className="header-actions">
          {isBootstrapping ? (
            <span className="user-chip">Загрузка...</span>
          ) : user ? (
            <>
              <span className="user-chip">{user.login}</span>
              <Button
                aria-label="Выйти из профиля"
                onClick={handleLogout}
                type="button"
                variant="secondary"
              >
                Выйти
              </Button>
            </>
          ) : (
            <Button
              aria-label="Перейти на страницу входа"
              asChild
              variant={location.pathname === '/login' ? 'secondary' : 'primary'}
            >
              <Link to="/login">Войти</Link>
            </Button>
          )}
        </div>
      </header>
      <main className={cn('page-content', isHomePage && 'page-content--home')}>
        <Outlet />
      </main>
    </div>
  )
}
