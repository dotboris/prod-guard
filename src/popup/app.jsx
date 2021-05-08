import React from 'react'
import { Router } from '@reach/router'
import WarningsListPage from './warnings/list-page'
import NewWarningPage from './warnings/new-page'
import EditWarningPage from './warnings/edit-page'

export default function App () {
  return (
    <Router>
      <WarningsListPage path='/' default />
      <NewWarningPage path='/new' />
      <EditWarningPage path='/edit/:id' />
    </Router>
  )
}
