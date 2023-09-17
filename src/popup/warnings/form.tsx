import browser from 'webextension-polyfill'
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
  onSave?: (warning: Warning) => void
  value?: Warning
}

interface FormData {
  warningStyle: Warning['warningStyle']
  pattern: Warning['pattern']
  borderColor: BorderWarning['borderColor']
  text: BannerWarning['text']
  textColor: BannerWarning['textColor']
  backgroundColor: BannerWarning['backgroundColor']
}

export default function WarningForm({
  onSave,
  value,
}: WarningFormProps): JSX.Element {
  const { register, handleSubmit, control, watch } = useForm<FormData>({
    defaultValues: async () => {
      const defaults: FormData = {
        warningStyle: 'topBanner',
        pattern: (await guessPattern()) ?? '',
        borderColor: 'FF0000',
        text: 'Warning! This is Production!',
        textColor: 'FFFFFF',
        backgroundColor: 'FF0000',
      }

      return {
        ...defaults,
        ...(value ?? {}),
      }
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

    if (onSave != null) {
      onSave(res)
    }
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
        {...register('pattern', { required: true })}
      />

      <label htmlFor={warningStyleId}>Style:</label>
      <select
        id={warningStyleId}
        {...register('warningStyle', { required: true })}
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
            render={({ field: { value, onChange } }) => (
              <ColorField
                id={borderColorId}
                value={value}
                onChange={onChange}
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
            {...register('text', { required: true })}
          />

          <label htmlFor={textColorId}>Text Color:</label>
          <Controller
            name='textColor'
            control={control}
            render={({ field: { value, onChange } }) => (
              <ColorField id={textColorId} value={value} onChange={onChange} />
            )}
          />

          <label htmlFor={backgroundColorId}>Background Color:</label>
          <Controller
            name='backgroundColor'
            control={control}
            render={({ field: { value, onChange } }) => (
              <ColorField
                id={backgroundColorId}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </>
      ) : null}

      <div className='controls'>
        <button type='submit'>Save</button>
      </div>
    </form>
  )
}

/**
 * Guess the pattern using the browser API. We able to, we'll generate a pattern
 * based on the current tab's URL.
 */
async function guessPattern(): Promise<string | undefined> {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true,
  })

  if (tabs.length > 0 && tabs[0].url != null) {
    const url = new URL(tabs[0].url)
    return url.host.replace(/\./g, '\\.')
  }
}
