import './form.scss'
import React, { useState } from 'react'
import { warningStyles } from './friendly-names'

export default function WarningForm ({ onSave, value, disabled = false }) {
  const [pattern, setPattern] = useState(
    value?.pattern ?? ''
  )
  const [warningStyle, setWarningStyle] = useState(
    value?.warningStyle ?? Object.keys(warningStyles)[0]
  )

  function handleSubmit (event) {
    event.preventDefault()
    onSave({
      pattern,
      warningStyle
    })
  }

  const styleOptions = Object.entries(warningStyles)
    .map(([key, name]) => (
      <option key={key} value={key}>{name}</option>
    ))

  return (
    <form
      className='site-form'
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
          {styleOptions}
        </select>
      </label>

      <FieldHelp>
        Controls what kind of warning to display.
      </FieldHelp>

      <div className='controls'>
        <button type='submit'>Save</button>
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
