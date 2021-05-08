import React from 'react'

export default function Icon ({ title, svg }) {
  return (
    <span
      className='icon'
      title={title}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
