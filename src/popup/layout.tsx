import './layout.scss'
import { Link } from 'react-router-dom'
import Icon from './icon'
import HomeIcon from '@fortawesome/fontawesome-free/svgs/solid/house-chimney.svg'
import { type PropsWithChildren } from 'react'

export interface LayoutProps {
  title: string
}

export default function Layout({
  title,
  children,
}: PropsWithChildren<LayoutProps>): JSX.Element {
  return (
    <div className='app'>
      <div className='title-bar'>
        <Link to='/'>
          <Icon svg={HomeIcon} title='Home' />
        </Link>

        <h1>{title}</h1>
      </div>

      <div className='page-content'>{children}</div>
    </div>
  )
}
