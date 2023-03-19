import './list-page.scss'
import React from 'react'
import { warningStyles } from './friendly-names'
import Icon from '../icon'
import EditIcon from '@fortawesome/fontawesome-free/svgs/solid/pen-to-square.svg'
import TrashIcon from '@fortawesome/fontawesome-free/svgs/solid/trash.svg'
import Layout from '../layout'
import { useAllWarnings, useRemoveWarningMutation } from './state'
import { Link } from 'react-router-dom'

export default function WarningsListPage() {
  return (
    <Layout title='Prod Guard'>
      <div className='warning-list'>
        <div className='title'>
          <h2>Warnings</h2>
          <Link className='button' to='/new'>
            New Warning
          </Link>
        </div>

        <WarningList />
      </div>
    </Layout>
  )
}

function WarningList() {
  const { isLoading, data: warnings } = useAllWarnings()

  if (isLoading) {
    return null
  }

  if (warnings.length > 0) {
    return (
      <ul className='items'>
        {warnings.map((warning) => (
          <li key={warning.id}>
            <WarningItem warning={warning} />
          </li>
        ))}
      </ul>
    )
  } else {
    return (
      <p className='nothing-here'>
        There's nothing here.
        <br />
        Click on "New Warning" to get started.
      </p>
    )
  }
}

function WarningItem({ warning }) {
  const removeWarningMutation = useRemoveWarningMutation()

  const {
    id,
    pattern,
    warningStyle,

    borderColor,

    text,
    textColor,
    backgroundColor,
  } = warning

  return (
    <>
      <div className='header'>
        <div className='pattern'>{pattern}</div>
        <Link className='action' to={`/edit/${id}`}>
          <Icon svg={EditIcon} title='Edit Warning' />
        </Link>
        <div
          className='action'
          onClick={() => removeWarningMutation.mutate({ id })}
        >
          <Icon svg={TrashIcon} title='Delete Warning' />
        </div>
      </div>
      <dl>
        <dt>Style:</dt>
        <dd>{warningStyles[warningStyle]}</dd>
        {warningStyle === 'border' ? (
          <>
            <dt>Color:</dt>
            <dd>
              <Color colorHex={borderColor} />
            </dd>
          </>
        ) : null}
        {['topBanner', 'bottomBanner'].includes(warningStyle) ? (
          <>
            <dt>Text:</dt>
            <dd>{text}</dd>
            <dt>Color:</dt>
            <dd>
              <Color colorHex={textColor} />
              {' on '}
              <Color colorHex={backgroundColor} />
            </dd>
          </>
        ) : null}
      </dl>
    </>
  )
}

function Color({ colorHex }) {
  return (
    <span className='color' style={{ '--color': `#${colorHex}` }}>
      #{colorHex.toUpperCase()}
    </span>
  )
}
