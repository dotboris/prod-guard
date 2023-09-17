import { type ChangeEventHandler, useCallback, useState } from 'react'
import './color-field.scss'

export interface ColorFieldProps {
  id?: string
  value: string
  disabled?: boolean
  required?: boolean
  onChange: (value: string) => void
}

export default function ColorField(props: ColorFieldProps): JSX.Element {
  const { id, value, disabled, required, onChange } = props
  const [rawValue, setRawValue] = useState(value)

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const newValue = event.target.value
      setRawValue(newValue)
      if (event.target.validity.valid) {
        onChange(newValue)
      }
    },
    [setRawValue, onChange],
  )

  return (
    <div className='color-field'>
      <div className='preview-wrapper'>
        <div className='preview' style={{ backgroundColor: `#${rawValue}` }} />
      </div>

      <input
        id={id}
        type='text'
        pattern='^[0-9a-fA-F]{3}|[0-9a-fA-F]{6}$'
        value={rawValue}
        disabled={disabled}
        required={required}
        onChange={handleChange}
      />
    </div>
  )
}
