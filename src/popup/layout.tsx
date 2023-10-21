import './layout.scss'
import { IconLink } from './components/icon'
import HomeIcon from '@fortawesome/fontawesome-free/svgs/solid/house-chimney.svg'
import GearIcon from '@fortawesome/fontawesome-free/svgs/solid/gear.svg'
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

      <div className='page-content'>{children}</div>
    </div>
  )
}
