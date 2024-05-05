import '@fontsource/roboto'
import '@fontsource-variable/roboto-mono'
import { css } from '@emotion/react'
import { fontStacks, palette } from './theme'
import CarretDownIcon from '@fortawesome/fontawesome-free/svgs/solid/caret-down.svg?data-uri'

export const GLOBAL_STYLES = css({
  '*': {
    boxSizing: 'border-box',
  },

  'html, body': {
    margin: 0,
    padding: 0,
    fontFamily: fontStacks.sans,
    width: '25rem',
  },

  html: {
    backgroundColor: 'white',
    color: 'black',
    fontSize: '16px',
  },

  body: {
    // Not sure why, but chrome sets a font-size: 75% here.
    fontSize: 'unset',
  },

  'input[type="text"]': {
    appearance: 'none',
    border: `1px solid ${palette.darkShade}`,
    backgroundColor: 'white',
    padding: '0.5rem',

    '&:hover, &:focus, &:active': {
      borderColor: palette.darkAccent,
    },

    '&:invalid': {
      color: 'red',
    },
  },

  select: {
    appearance: 'none',
    border: `1px solid ${palette.darkShade}`,
    background: `url(${CarretDownIcon}) right 0.5rem top 50%/0.5rem no-repeat white`,
    padding: '0.5rem 1.5rem 0.5rem 0.5rem',

    '&:hover, &:focus, &:active': {
      borderColor: palette.darkAccent,
    },
  },

  textarea: {
    fontFamily: fontStacks.monospace,
  },

  'h1, h2': {
    fontWeight: 700,
    margin: '0.25em 0 0.5em',
  },

  h1: {
    fontSize: '1.5em',
  },

  h2: {
    fontSize: '1.3em',
  },
})
