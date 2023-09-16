import './form.scss'
import { type FormEventHandler, useId } from 'react'
import { type SubmitHandler, Controller, useForm } from 'react-hook-form'
import ColorField from '../color-field'
import { warningStyles } from './friendly-names'
import {
  type BannerWarning,
  type BorderWarning,
  type Warning,
} from '../../warnings'

export interface WarningFormProps {
  onSave: (warning: Warning) => void
  value?: Warning
  disabled?: boolean
}

interface FormData {
  warningStyle: Warning['warningStyle']
  pattern: Warning['pattern']
  borderColor: BorderWarning['borderColor']
  text: BannerWarning['text']
  textColor: BannerWarning['textColor']
  backgroundColor: BannerWarning['backgroundColor']
}

const defaultValues: FormData = {
  warningStyle: 'topBanner',
  pattern: '',
  borderColor: 'FF0000',
  text: 'Warning! This is Production!',
  textColor: 'FFFFFF',
  backgroundColor: 'FF0000',
}

export default function WarningForm({
  onSave,
  value,
  disabled = false,
}: WarningFormProps): JSX.Element {
  const { register, handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: {
      ...defaultValues,
      ...(value ?? {}),
    },
  })

  const patternId = useId()
  const warningStyleId = useId()
  const textId = useId()
  const borderColorId = useId()
  const backgroundColorId = useId()
  const textColorId = useId()

  const onSubmit: SubmitHandler<FormData> = (data) => {
    let res: Warning
    switch (data.warningStyle) {
      case 'bottomBanner':
      case 'topBanner':
        res = {
          warningStyle: data.warningStyle,
          pattern: data.pattern,
          text: data.text,
          textColor: data.textColor,
          backgroundColor: data.backgroundColor,
        }
        break

      case 'border':
        res = {
          warningStyle: data.warningStyle,
          pattern: data.pattern,
          borderColor: data.borderColor,
        }
        break
    }

    onSave(res)
  }

  return (
    <form
      className='warning-form'
      // handleSubmit returns a promise but that's how the doc says to use this.
      onSubmit={handleSubmit(onSubmit) as FormEventHandler}
    >
      <label htmlFor={patternId}>URL Regex:</label>
      <input
        id={patternId}
        type='text'
        {...register('pattern', { required: true, disabled })}
      />

      <label htmlFor={warningStyleId}>Style:</label>
      <select
        id={warningStyleId}
        {...register('warningStyle', { required: true, disabled })}
      >
        {Object.entries(warningStyles).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>

      {watch('warningStyle') === 'border' ? (
        <>
          <label htmlFor={borderColorId}>Border Color:</label>
          <Controller
            name='borderColor'
            control={control}
            disabled={disabled}
            render={({ field: { value, onChange, disabled } }) => (
              <ColorField
                id={borderColorId}
                value={value}
                onChange={onChange}
                disabled={disabled}
              />
            )}
          />
        </>
      ) : null}

      {['topBanner', 'bottomBanner'].includes(watch('warningStyle')) ? (
        <>
          <label htmlFor={textId}>Message:</label>
          <input
            id={textId}
            type='text'
            {...register('text', { required: true, disabled })}
          />

          <label htmlFor={textColorId}>Text Color:</label>
          <Controller
            name='textColor'
            control={control}
            disabled={disabled}
            render={({ field: { value, onChange, disabled } }) => (
              <ColorField
                id={textColorId}
                value={value}
                onChange={onChange}
                disabled={disabled}
              />
            )}
          />

          <label htmlFor={backgroundColorId}>Background Color:</label>
          <Controller
            name='backgroundColor'
            control={control}
            disabled={disabled}
            render={({ field: { value, onChange, disabled } }) => (
              <ColorField
                id={backgroundColorId}
                value={value}
                onChange={onChange}
                disabled={disabled}
              />
            )}
          />
        </>
      ) : null}

      <div className='controls'>
        <button type='submit' disabled={disabled}>
          Save
        </button>
      </div>
    </form>
  )
}
