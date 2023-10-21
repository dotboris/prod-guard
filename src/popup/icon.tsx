import { css } from '@emotion/react'

const styles = {
  button: css({
    background: 'none',
    padding: 0,
    color: 'black',
  }),
}

export function Icon({
  title,
  svg,
}: {
  title: string
  svg: string
}): JSX.Element {
  return (
    <span
      className='icon'
      title={title}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export function IconButton({
  title,
  svg,
  onClick,
  className,
}: {
  title: string
  svg: string
  onClick: () => void
  className?: string
}): JSX.Element {
  return (
    <button
      css={styles.button}
      className={className}
      type='button'
      onClick={onClick}
    >
      <Icon title={title} svg={svg} />
    </button>
  )
}
