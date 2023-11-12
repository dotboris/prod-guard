import { warningStyles } from './friendly-names'
import { IconButton, IconLink } from '../components/icon'
import EditIcon from '@fortawesome/fontawesome-free/svgs/solid/pen-to-square.svg'
import TrashIcon from '@fortawesome/fontawesome-free/svgs/solid/trash.svg'
import ToggleOnIcon from '@fortawesome/fontawesome-free/svgs/solid/toggle-on.svg'
import ToggleOffIcon from '@fortawesome/fontawesome-free/svgs/solid/toggle-off.svg'
import Layout from '../components/layout'
import { type WarningWithId } from '../../schema'
import { type CSSProperties } from 'react'
import { trpc } from '../trpc'
import { css } from '@emotion/react'
import { palette } from '../theme'
import { LinkButton } from '../components/button'

const pageStyles = {
  title: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '0.5rem',

    h2: {
      flexGrow: 1,
      margin: 0,
    },
  }),
}

export default function WarningsListPage(): JSX.Element {
  return (
    <Layout title='Prod Guard'>
      <div>
        <div css={pageStyles.title}>
          <h2>Warnings</h2>
          <LinkButton to='/new'>New Warning</LinkButton>
        </div>

        <WarningList />
      </div>
    </Layout>
  )
}

const listStyles = {
  root: css({
    margin: 0,
    padding: 0,
    listStyle: 'none',
  }),

  item: css({
    padding: '1rem',
    borderBottom: '1px solid #ddd',

    '&:last-child': {
      marginBottom: 0,
      borderBottom: 'none',
    },

    '&:hover': {
      backgroundColor: palette.lightShade,
    },
  }),

  emptyState: css({
    padding: '3rem 0',
    textAlign: 'center',
  }),
}

function WarningList(): JSX.Element | undefined {
  const { isLoading, data: warnings } = trpc.warnings.list.useQuery()

  if (isLoading || warnings == null) {
    return undefined
  }

  if (warnings.length > 0) {
    return (
      <ul css={listStyles.root}>
        {warnings.map((warning) => (
          <li key={warning.id} css={listStyles.item}>
            <WarningItem warning={warning} />
          </li>
        ))}
      </ul>
    )
  } else {
    return (
      <p css={listStyles.emptyState}>
        There's nothing here.
        <br />
        Click on "New Warning" to get started.
      </p>
    )
  }
}

const itemStyles = {
  header: css({
    display: 'flex',
    flexDirection: 'row',
    marginBottom: '1rem',
    fontSize: '1.1rem',
    gap: '1rem',
    alignItems: 'start',
  }),

  pattern: css({
    fontFamily: `'Lucida Console', Monaco, monospace`,
    flexGrow: 1,
    alignSelf: 'center',
  }),

  properties: css({
    display: 'grid',
    gridTemplateColumns: 'min-content 1fr',
    gap: '0.5em',
    margin: 0,

    '> *': {
      margin: 0,
    },
  }),
}

function WarningItem({ warning }: { warning: WarningWithId }): JSX.Element {
  const removeWarningMutation = trpc.warnings.remove.useMutation()
  const toggleWarningMutation = trpc.warnings.toggleEnabled.useMutation()

  return (
    <>
      <div css={itemStyles.header}>
        <div css={itemStyles.pattern}>{warning.pattern}</div>
        <IconButton
          svg={warning.enabled ? ToggleOnIcon : ToggleOffIcon}
          title={warning.enabled ? 'Disable warning' : 'Enable warning'}
          onClick={() => {
            toggleWarningMutation.mutate({ id: warning.id })
          }}
          theme='dark'
          size='1.5rem'
        />
        <IconLink
          to={`/edit/${warning.id}`}
          svg={EditIcon}
          title='Edit Warning'
          theme='dark'
          size='1.5rem'
        />
        <IconButton
          svg={TrashIcon}
          title='Delete Warning'
          onClick={() => {
            removeWarningMutation.mutate({ id: warning.id })
          }}
          theme='dark'
          size='1.5rem'
        />
      </div>
      <dl css={itemStyles.properties}>
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

const colorStyles = {
  root: css({
    whiteSpace: 'nowrap',
    '&::before': {
      display: 'inline-block',
      verticalAlign: 'baseline',
      marginRight: '0.25em',
      content: "''",
      width: '0.6em',
      height: '0.6em',
      border: '1px solid black',
      backgroundColor: 'var(--color)',
    },
  }),
}

interface ColorCSSProperties extends CSSProperties {
  '--color': string
}

function Color({ colorHex }: { colorHex: string }): JSX.Element {
  const style: ColorCSSProperties = {
    '--color': `#${colorHex}`,
  }

  return (
    <span css={colorStyles.root} style={style}>
      #{colorHex.toUpperCase()}
    </span>
  )
}
