import './form.scss'
import React, { useCallback, useId, useState } from 'react'
import ColorField from '../color-field'
import { warningStyles } from './friendly-names'

export default function WarningForm({ onSave, value, disabled = false }) {
  const patternId = useId()
  const [pattern, setPattern] = useState(value?.pattern ?? '')

  const warningStyleId = useId()
  const [warningStyle, setWarningStyle] = useState(
    value?.warningStyle ?? Object.keys(warningStyles)[0],
  )

  const textId = useId()
  const [text, setText] = useState(
    value?.text ?? 'Warning! This is Production!',
  )

  const borderColorId = useId()
  const [borderColor, setBorderColor] = useState(value?.borderColor ?? 'FF0000')

  const backgroundColorId = useId()
  const [backgroundColor, setBackgroundColor] = useState(
    value?.backgroundColor ?? 'FF0000',
  )

  const textColorId = useId()
  const [textColor, setTextColor] = useState(value?.textColor ?? 'FFFFFF')

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault()
      const payload = {
        pattern,
        warningStyle,
      }

      switch (warningStyle) {
        case 'bottomBanner':
        case 'topBanner':
          payload.text = text
          payload.backgroundColor = backgroundColor
          payload.textColor = textColor
          break

        case 'border':
          payload.borderColor = borderColor
          break
      }

      onSave(payload)
    },
    [
      backgroundColor,
      borderColor,
      onSave,
      pattern,
      text,
      textColor,
      warningStyle,
    ],
  )

  return (
    <form className='warning-form' onSubmit={handleSubmit}>
      <label htmlFor={patternId}>URL Regex:</label>
      <input
        id={patternId}
        type='text'
        required
        value={pattern}
        onChange={(e) => setPattern(e.target.value)}
        disabled={disabled}
      />

      <label htmlFor={warningStyleId}>Style:</label>
      <select
        id={warningStyleId}
        required
        value={warningStyle}
        onChange={(e) => setWarningStyle(e.target.value)}
        disabled={disabled}
      >
        {Object.entries(warningStyles).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>

      {warningStyle === 'border' ? (
        <>
          <label htmlFor={borderColorId}>Border Color:</label>
          <ColorField
            id={borderColorId}
            value={borderColor}
            onChange={setBorderColor}
            disabled={disabled}
          />
        </>
      ) : null}

      {['topBanner', 'bottomBanner'].includes(warningStyle) ? (
        <>
          <label htmlFor={textId}>Message:</label>
          <input
            id={textId}
            type='text'
            required
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={disabled}
          />

          <label htmlFor={textColorId}>Text Color:</label>
          <ColorField
            id={textColorId}
            value={textColor}
            onChange={setTextColor}
            disabled={disabled}
          />

          <label htmlFor={backgroundColorId}>Background Color:</label>
          <ColorField
            id={backgroundColorId}
            value={backgroundColor}
            onChange={setBackgroundColor}
            disabled={disabled}
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
