import './list-page.scss'
import { warningStyles } from './friendly-names'
import { Icon, IconButton } from '../icon'
import EditIcon from '@fortawesome/fontawesome-free/svgs/solid/pen-to-square.svg'
import TrashIcon from '@fortawesome/fontawesome-free/svgs/solid/trash.svg'
import ToggleOnIcon from '@fortawesome/fontawesome-free/svgs/solid/toggle-on.svg'
import ToggleOffIcon from '@fortawesome/fontawesome-free/svgs/solid/toggle-off.svg'
import Layout from '../layout'
import { Link } from 'react-router-dom'
import { type WarningWithId } from '../../schema'
import { type CSSProperties } from 'react'
import { trpc } from '../trpc'

export default function WarningsListPage(): JSX.Element {
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

function WarningList(): JSX.Element | undefined {
  const { isLoading, data: warnings } = trpc.warnings.list.useQuery()

  if (isLoading || warnings == null) {
    return undefined
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

function WarningItem({ warning }: { warning: WarningWithId }): JSX.Element {
  const removeWarningMutation = trpc.warnings.remove.useMutation()
  const toggleWarningMutation = trpc.warnings.toggleEnabled.useMutation()

  return (
    <>
      <div className='header'>
        <div className='pattern'>{warning.pattern}</div>
        <IconButton
          svg={warning.enabled ? ToggleOnIcon : ToggleOffIcon}
          title={warning.enabled ? 'Disable warning' : 'Enable warning'}
          onClick={() => {
            toggleWarningMutation.mutate({ id: warning.id })
          }}
        />
        <Link className='action' to={`/edit/${warning.id}`}>
          <Icon svg={EditIcon} title='Edit Warning' />
        </Link>
        <div
          className='action'
          onClick={() => {
            removeWarningMutation.mutate({ id: warning.id })
          }}
        >
          <Icon svg={TrashIcon} title='Delete Warning' />
        </div>
      </div>
      <dl>
        <dt>Style:</dt>
        <dd>{warningStyles[warning.warningStyle]}</dd>
        {warning.warningStyle === 'border' ? (
          <>
            <dt>Color:</dt>
            <dd>
              <Color colorHex={warning.borderColor} />
            </dd>
          </>
        ) : null}
        {warning.warningStyle === 'topBanner' ||
        warning.warningStyle === 'bottomBanner' ? (
          <>
            <dt>Text:</dt>
            <dd>{warning.text}</dd>
            <dt>Color:</dt>
            <dd>
              <Color colorHex={warning.textColor} />
              {' on '}
              <Color colorHex={warning.backgroundColor} />
            </dd>
          </>
        ) : null}
      </dl>
    </>
  )
}

interface ColorCSSProperties extends CSSProperties {
  '--color': string
}

function Color({ colorHex }: { colorHex: string }): JSX.Element {
  const style: ColorCSSProperties = {
    '--color': `#${colorHex}`,
  }

  return (
    <span className='color' style={style}>
      #{colorHex.toUpperCase()}
    </span>
  )
}
