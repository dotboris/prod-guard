export interface IconProps {
  title: string
  svg: string
}

export default function Icon({ title, svg }: IconProps): JSX.Element {
  return (
    <span
      className='icon'
      title={title}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
