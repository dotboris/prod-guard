import '@fontsource-variable/open-sans'
import { IconLink } from './icon'
import HomeIcon from '@fortawesome/fontawesome-free/svgs/solid/house-chimney.svg'
import GearIcon from '@fortawesome/fontawesome-free/svgs/solid/gear.svg'
import { type PropsWithChildren } from 'react'
import { css } from '@emotion/react'
import { palette } from '../theme'

const styles = {
  root: css({
    width: '25rem',
    fontFamily: "'Open Sans Variable', sans-serif",
  }),

  titleBar: css({
    top: 0,
    position: 'sticky',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: 'white',
    backgroundColor: palette.darkShade,

    '> *': {
      padding: '0.75rem 1rem',
    },

    h1: {
      flexGrow: 1,
      fontSize: '1.5rem',
      lineHeight: 1,
      margin: 0,
      padding: 0,
    },
  }),

  content: css({
    padding: '1rem',
  }),
}

export interface LayoutProps {
  title: string
}

export default function Layout({
  title,
  children,
}: PropsWithChildren<LayoutProps>): JSX.Element {
  return (
    <div css={styles.root} data-testid='layout-root'>
      <div css={styles.titleBar}>
        <IconLink
          to='/'
          svg={HomeIcon}
          title='Home'
          size='1.5rem'
          theme='light'
        />

        <h1>{title}</h1>

        <IconLink
          to='/settings'
          svg={GearIcon}
          title='Settings'
          size='1.5rem'
          theme='light'
        />
      </div>

      <div css={styles.content}>{children}</div>
    </div>
  )
}
