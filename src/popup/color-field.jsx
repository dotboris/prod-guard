import React, { useState } from 'react'
import './color-field.scss'

export default function ColorField ({ value, disabled, onChange }) {
  const [rawValue, setRawValue] = useState(value)

  function handleChange (event) {
    const newValue = event.target.value
    setRawValue(newValue)
    if (event.target.validity.valid) {
      onChange(newValue)
    }
  }

  return (
    <div className='color-field'>
      <div className='preview-wrapper'>
        <div
          className='preview'
          style={{ backgroundColor: `#${rawValue}` }}
        />
      </div>

      <input
        type='text'
        pattern='^[0-9a-fA-F]{3}|[0-9a-fA-F]{6}$'
        value={rawValue}
        disabled={disabled}
        onChange={handleChange}
      />
    </div>
  )
}
