import { type JSX } from 'react'

export default function ExportBox(): JSX.Element {
  const data = { foo: 'bar' } // TODO: real data
  const formattedData = JSON.stringify(data, null, 2)

  return <textarea readOnly>{formattedData}</textarea>
}
