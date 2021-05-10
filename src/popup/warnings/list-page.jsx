import './list-page.scss'
import React from 'react'
import { warningStyles } from './friendly-names'
import Icon from '../icon'
import EditIcon from '@fortawesome/fontawesome-free/svgs/solid/edit.svg'
import TrashIcon from '@fortawesome/fontawesome-free/svgs/solid/trash.svg'
import Layout from '../layout'
import { useAllWarnings, useRemoveWarningMutation } from './state'
import { Link } from '@reach/router'
import { hasText } from './util'

export default function WarningsListPage () {
  return (
    <Layout title='Prod Guard'>
      <div className='warning-list'>
        <div className='title'>
          <h2>Warnings</h2>
          <Link className='button' to='/new'>New Warning</Link>
        </div>

        <WarningList />
      </div>
    </Layout>
  )
}

function WarningList () {
  const { isLoading, data: warnings } = useAllWarnings()

  if (isLoading) {
    return null
  }

  if (warnings.length > 0) {
    return (
      <div className='items'>
        {warnings.map(warning =>
          <WarningItem
            key={warning.id}
            warning={warning}
          />
        )}
      </div>
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

function WarningItem ({ warning }) {
  const removeWarningMutation = useRemoveWarningMutation()

  const {
    id,
    pattern,
    warningStyle,
    text
  } = warning

  return (
    <div>
      <div className='details'>
        <p className='pattern'>{pattern}</p>
        <dl>
          <dt>Style:</dt>
          <dd>{warningStyles[warningStyle]}</dd>
          {hasText(warningStyle)
            ? <><dt>Text:</dt><dd>{text}</dd></>
            : null}
        </dl>
      </div>
      <Link className='action' to={`/edit/${id}`}>
        <Icon svg={EditIcon} title='Edit Warning' />
      </Link>
      <div className='action' onClick={() => removeWarningMutation.mutate({ id })}>
        <Icon svg={TrashIcon} title='Delete Warning' />
      </div>
    </div>
  )
}
