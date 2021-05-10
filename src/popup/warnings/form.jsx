import './form.scss'
import React, { useState } from 'react'
import { warningStyles } from './friendly-names'
import { hasText } from './util'

export default function WarningForm ({ onSave, value, disabled = false }) {
  const [pattern, setPattern] = useState(value?.pattern ?? '')
  const [warningStyle, setWarningStyle] = useState(
    value?.warningStyle ?? Object.keys(warningStyles)[0]
  )
  const [text, setText] = useState(value?.text ?? 'Warning! This is Production!')

  function handleSubmit (event) {
    event.preventDefault()
    const payload = {
      pattern,
      warningStyle
    }

    if (hasText(warningStyle)) {
      payload.text = text
    }

    onSave(payload)
  }

  return (
    <form
      className='warning-form'
      onSubmit={handleSubmit}
    >
      <label className='field'>
        <span>URL Pattern:</span>
        <input
          type='text'
          required
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          disabled={disabled}
        />
      </label>

      <FieldHelp>
        A regular expression matched against a tab's URL.
        If there's a match, the warning is displayed.
      </FieldHelp>

      <label className='field'>
        <span>Style:</span>
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
      </label>

      <FieldHelp>
        Controls what kind of warning to display.
      </FieldHelp>

      {hasText(warningStyle)
        ? (
          <label className='field'>
            <span>Text:</span>
            <input
              type='text'
              required
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={disabled}
            />
          </label>)
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
