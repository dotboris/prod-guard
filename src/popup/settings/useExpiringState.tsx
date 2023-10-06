import { useState, useEffect } from 'react'

export function useExpiringState<T>(
  defaultValue: T,
  timeout: number,
): [T, (value: T) => void] {
  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    if (value !== defaultValue) {
      const handle = setTimeout(() => {
        setValue(defaultValue)
      }, timeout)
      return () => {
        clearTimeout(handle)
      }
    }
  }, [defaultValue, timeout, value, setValue])
  return [value, setValue]
}
