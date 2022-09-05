import React from 'react'
import WarningsListPage from './warnings/list-page'
import NewWarningPage from './warnings/new-page'
import EditWarningPage from './warnings/edit-page'
import { Routes, Route } from 'react-router'

export default function App () {
  return (
    <Routes>
      <Route path='*' element={<WarningsListPage />} />
      <Route path='/new' element={<NewWarningPage />} />
      <Route path='/edit/:id' element={<EditWarningPage />} />
    </Routes>
  )
}
