import { SerializedStyles, css } from '@emotion/react'
import { Button } from './button'
import { ButtonHTMLAttributes } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { omit, pick } from 'lodash-es'
import { palette } from '../../theme'

const styles = {
  icon: css({
    fill: 'currentcolor',
    display: 'inline-block',
    svg: {
      fill: 'currentcolor',
      display: 'inline-block',
    },
  }),

  iconLight: css({
    color: 'white',
    '&:hover, &:active': {
      color: palette.main,
    },
  }),
  iconDark: css({
    color: 'black',
    '&:hover, &:active': {
      color: palette.darkAccent,
    },
  }),

  button: css({
    background: 'none',
    padding: 0,
    color: 'black',
  }),
}

interface IconProps {
  title: string
  svg: string
  theme: 'light' | 'dark'
  size?: string
}

export function Icon({ title, svg, size, theme }: IconProps): JSX.Element {
  let themeCss: SerializedStyles
  switch (theme) {
    case 'light':
      themeCss = styles.iconLight
      break
    case 'dark':
      themeCss = styles.iconDark
      break
  }

  return (
    <span
      css={css(styles.icon, themeCss)}
      style={{
        width: size ?? '1rem',
        height: size ?? '1rem',
      }}
      title={title}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export function IconButton(
  props: IconProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>,
): JSX.Element {
  return (
    <Button css={styles.button} {...nonIconProps(props)} type='button'>
      <Icon {...iconProps(props)} />
    </Button>
  )
}

export function IconLink(props: IconProps & LinkProps): JSX.Element {
  return (
    <Link {...nonIconProps(props)}>
      <Icon {...iconProps(props)} />
    </Link>
  )
}

function iconProps<T>(props: T & IconProps): IconProps {
  return pick(props, ['title', 'svg', 'size', 'theme'])
}

function nonIconProps<T extends object & IconProps>(
  props: T,
): Omit<T, keyof IconProps> {
  return omit(props, ['title', 'svg', 'size', 'theme'])
}
