import { useNavigate } from 'react-router-dom'
import { Form, Formik, FormikHelpers } from 'formik'
import { toast } from 'sonner'
import { loginUser } from '@/features/auth/model/authSlice'
import { loginValidationSchema } from '@/features/auth/model/loginSchema'
import { LoginFormValues } from '@/features/auth/model/types'
import { useAppDispatch, useAppSelector } from '@/shared/hooks/redux'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'

type LoginStatus = {
  type: 'success' | 'error'
  message: string
}

const initialValues: LoginFormValues = {
  login: '',
  password: ''
}

export const LoginForm = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status } = useAppSelector((state) => state.auth)

  const handleSubmit = async (
    values: LoginFormValues,
    formikHelpers: FormikHelpers<LoginFormValues>,
  ) => {
    const loadingToastId = toast.loading('Проверяем учетные данные')

    try {
      await dispatch(loginUser(values)).unwrap()
      formikHelpers.setStatus({
        type: 'success',
        message: 'Авторизация выполнена'
      } satisfies LoginStatus)
      toast.success('Вход выполнен', { id: loadingToastId })
      navigate('/')
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Не удалось выполнить вход'

      formikHelpers.setStatus({
        type: 'error',
        message: errorMessage
      } satisfies LoginStatus)
      toast.error(errorMessage, { id: loadingToastId })
    }
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={loginValidationSchema}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        isSubmitting,
        status: formStatus,
        touched,
        values
      }) => (
        <Form className="form-layout">
          <label className="field">
            <span className="field-label">Логин</span>
            <Input
              aria-label="Введите логин"
              name="login"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="admin-login"
              value={values.login}
            />
            {touched.login && errors.login ? (
              <span className="field-error">{errors.login}</span>
            ) : null}
          </label>

          <label className="field">
            <span className="field-label">Пароль</span>
            <Input
              aria-label="Введите пароль"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              placeholder="Введите пароль"
              type="password"
              value={values.password}
            />
            {touched.password && errors.password ? (
              <span className="field-error">{errors.password}</span>
            ) : null}
          </label>

          {formStatus ? (
            <p
              className={
                formStatus.type === 'error' ? 'field-error' : 'field-success'
              }
            >
              {formStatus.message}
            </p>
          ) : null}

          <Button
            aria-label="Выполнить вход"
            disabled={isSubmitting || status === 'loading'}
            type="submit"
          >
            {isSubmitting || status === 'loading' ? 'Входим...' : 'Войти'}
          </Button>
        </Form>
      )}
    </Formik>
  )
}
