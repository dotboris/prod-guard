import browser from 'webextension-polyfill'
import { useAsyncFn } from 'react-use'
import { Button } from './button'
import { useEffect } from 'react'
import { Icon } from './icon'
import AlertIcon from '@fortawesome/fontawesome-free/svgs/solid/triangle-exclamation.svg'
import { css } from '@emotion/react'
import { palette } from '../theme'

const PERMISSIONS = {
  origins: ['*://*/*'],
}

const styles = {
  root: css({
    background: palette.yellow100,
    padding: '1rem',
    marginBottom: '1rem',

    '& > :first-child': {
      marginTop: 0,
    },
    '& > :last-child': {
      marginBottom: 0,
    },
  }),
  icon: css({
    margin: '0.25rem 0.5rem 0 0',
    display: 'block',
    float: 'left',
  }),
  button: css({
    fontSize: '1rem',
    display: 'block',
    maxWidth: 'fit-content',
    margin: 'auto',
  }),
}

export function MissingPermissionsAlert(): JSX.Element | undefined {
  const [{ value: hasPermission, loading }, checkPermission] = useAsyncFn(
    async () => await browser.permissions.contains(PERMISSIONS),
  )
  useEffect(() => {
    void checkPermission()
  }, [checkPermission])

  if (loading) {
    return
  }

  if (hasPermission !== true) {
    return (
      <div css={styles.root}>
        <p>
          <Icon
            css={styles.icon}
            size='1.75rem'
            title='alert'
            theme='dark'
            svg={AlertIcon}
          />
          Prod Guard is missing an important permission that is required for it
          to function correctly. It needs the "Access data for all websites"
          permission. This permission is used to add warnings to webpages.
        </p>
        <p>
          To ensure that Prod Guard continues to work correctly, please click on
          the button below and grant the requested permission.
        </p>
        <Button
          css={styles.button}
          onClick={() => {
            void (async () => {
              await browser.permissions.request(PERMISSIONS)
              await checkPermission()
            })()
          }}
        >
          Open Permission Prompt
        </Button>
      </div>
    )
  }
}
