import { ChangeEvent } from 'react'
import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { UploadTrackPayload } from '@/entities/track/model/types'
import { Button } from '@/shared/ui/Button'
import { Card } from '@/shared/ui/Card'
import { Input } from '@/shared/ui/Input'

type UploadTrackFormValues = {
  title: string
  artist: string
  audioFile: File | null
}

type UploadTrackFormProps = {
  onSubmitTrack: (payload: UploadTrackPayload) => Promise<void>
}

type UploadStatus = {
  type: 'success' | 'error'
  message: string
}

const uploadValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required('Введите название трека')
    .max(80, 'Название слишком длинное'),
  artist: Yup.string()
    .trim()
    .required('Введите имя исполнителя')
    .max(80, 'Имя исполнителя слишком длинное'),
  audioFile: Yup.mixed<File>()
    .required('Выберите аудиофайл')
    .test(
      'supported-format',
      'Допустимы только mp3, wav и ogg',
      (audioFile) =>
        !audioFile ||
        ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg'].includes(
          audioFile.type,
        ) ||
        /\.(mp3|wav|ogg)$/i.test(audioFile.name),
    )
})

const initialValues: UploadTrackFormValues = {
  title: '',
  artist: '',
  audioFile: null
}

export const UploadTrackForm = ({ onSubmitTrack }: UploadTrackFormProps) => {
  const handleSubmit = async (
    values: UploadTrackFormValues,
    formikHelpers: FormikHelpers<UploadTrackFormValues>,
  ) => {
    if (!values.audioFile) {
      formikHelpers.setStatus({
        type: 'error',
        message: 'Файл обязателен'
      } satisfies UploadStatus)
      return
    }

    try {
      await onSubmitTrack({
        title: values.title,
        artist: values.artist,
        audioFile: values.audioFile
      })
      formikHelpers.resetForm()
      formikHelpers.setStatus({
        type: 'success',
        message: 'Трек успешно загружен'
      } satisfies UploadStatus)
    } catch (error) {
      formikHelpers.setStatus({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Не удалось загрузить трек'
      } satisfies UploadStatus)
    }
  }

  return (
    <Card className="section-card upload-card">
      <div className="section-heading">
        <div>
          <div className="eyebrow">Загрузка</div>
          <h2>Добавить музыкальное произведение</h2>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={uploadValidationSchema}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          isSubmitting,
          setFieldValue,
          status,
          touched,
          values
        }) => {
          const handleAudioFileChange = (
            event: ChangeEvent<HTMLInputElement>,
          ) => {
            const selectedFile = event.currentTarget.files?.[0] ?? null
            void setFieldValue('audioFile', selectedFile)
          }

          return (
            <Form className="form-layout">
              <div className="field-grid">
                <label className="field">
                  <span className="field-label">Название</span>
                  <Input
                    aria-label="Введите название трека"
                    name="title"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Nocturne in Motion"
                    value={values.title}
                  />
                  {touched.title && errors.title ? (
                    <span className="field-error">{errors.title}</span>
                  ) : null}
                </label>

                <label className="field">
                  <span className="field-label">Исполнитель</span>
                  <Input
                    aria-label="Введите имя исполнителя"
                    name="artist"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Ensemble Moderne"
                    value={values.artist}
                  />
                  {touched.artist && errors.artist ? (
                    <span className="field-error">{errors.artist}</span>
                  ) : null}
                </label>
              </div>

              <label className="field">
                <span className="field-label">Аудиофайл</span>
                <Input
                  accept=".mp3,.wav,.ogg,audio/mpeg,audio/wav,audio/ogg"
                  aria-label="Выберите аудиофайл"
                  name="audioFile"
                  onBlur={handleBlur}
                  onChange={handleAudioFileChange}
                  type="file"
                />
                {touched.audioFile && errors.audioFile ? (
                  <span className="field-error">{errors.audioFile}</span>
                ) : null}
              </label>

              {status ? (
                <p className={status.type === 'error' ? 'field-error' : 'field-success'}>
                  {status.message}
                </p>
              ) : null}

              <Button
                aria-label="Загрузить трек"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? 'Загружаем...' : 'Добавить трек'}
              </Button>
            </Form>
          )
        }}
      </Formik>
    </Card>
  )
}
