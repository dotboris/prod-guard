import './form.scss'
import React, { useState } from 'react'
import ColorField from '../color-field'
import { warningStyles } from './friendly-names'

export default function WarningForm ({ onSave, value, disabled = false }) {
  const [pattern, setPattern] = useState(value?.pattern ?? '')
  const [warningStyle, setWarningStyle] = useState(
    value?.warningStyle ?? Object.keys(warningStyles)[0]
  )
  const [text, setText] = useState(value?.text ?? 'Warning! This is Production!')
  const [borderColor, setBorderColor] = useState(value?.borderColor ?? 'FF0000')
  const [backgroundColor, setBackgroundColor] = useState(value?.backgroundColor ?? 'FF0000')
  const [textColor, setTextColor] = useState(value?.textColor ?? 'FFFFFF')

  function handleSubmit (event) {
    event.preventDefault()
    const payload = {
      pattern,
      warningStyle
    }

    switch (warningStyle) {
      case 'bottomBanner':
      case 'topBanner':
        payload.text = text
        break
    }

    onSave(payload)
  }

  return (
    <form
      className='warning-form'
      onSubmit={handleSubmit}
    >
      <label>URL Regex:</label>
      <input
        type='text'
        required
        value={pattern}
        onChange={e => setPattern(e.target.value)}
        disabled={disabled}
      />

      <label>Style:</label>
      <select
        required
        value={warningStyle}
        onChange={e => setWarningStyle(e.target.value)}
        disabled={disabled}
      >
        {Object.entries(warningStyles)
          .map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
      </select>

      {warningStyle === 'border'
        ? (
          <>
            <label>Border Color:</label>
            <ColorField
              value={borderColor}
              onChange={setBorderColor}
              disabled={disabled}
            />
          </>)
        : null}

      {['topBanner', 'bottomBanner'].includes(warningStyle)
        ? (
          <>
            <label>Message:</label>
            <input
              type='text'
              required
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={disabled}
            />

            <label>Text Color:</label>
            <ColorField
              value={textColor}
              onChange={setTextColor}
              disabled={disabled}
            />

            <label>Background Color:</label>
            <ColorField
              value={backgroundColor}
              onChange={setBackgroundColor}
              disabled={disabled}
            />
          </>)
        : null}

      <div className='controls'>
        <button
          type='submit'
          disabled={disabled}
        >
          Save
        </button>
      </div>
    </form>
  )
}

function FieldHelp ({ children }) {
  return (
    <div className='field-help'>
      <div className='text'>{children}</div>
    </div>
  )
}
