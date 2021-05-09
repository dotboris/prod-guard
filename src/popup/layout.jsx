import React from 'react'
import { Link } from '@reach/router'
import Icon from './icon'
import HomeIcon from '@fortawesome/fontawesome-free/svgs/solid/home.svg'

export default function Layout ({ title, children }) {
  return (
    <div className='app'>
      <div className='title-bar'>
        <Link to='/'>
          <Icon
            svg={HomeIcon}
            title='Home'
          />
        </Link>

        <h1>{title}</h1>
      </div>

      <div className='page-content'>{children}</div>
    </div>
  )
}
