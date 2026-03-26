import * as Yup from 'yup'

export const loginValidationSchema = Yup.object({
  login: Yup.string()
    .trim()
    .required('Введите логин')
    .max(64, 'Логин слишком длинный'),
  password: Yup.string()
    .trim()
    .required('Введите пароль')
    .max(128, 'Пароль слишком длинный')
})
