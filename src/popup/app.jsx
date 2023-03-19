import React from 'react'
import WarningsListPage from './warnings/list-page'
import NewWarningPage from './warnings/new-page'
import EditWarningPage from './warnings/edit-page'
import { Routes, Route } from 'react-router'
import { Redirect } from './redirect'

export default function App() {
  return (
    <Routes>
      {/* The popup starts at /popup.html. We normalize that to / */}
      <Route path='/popup.html' element={<Redirect to='/' />} />
      <Route path='/' element={<WarningsListPage />} />
      <Route path='/new' element={<NewWarningPage />} />
      <Route path='/edit/:id' element={<EditWarningPage />} />
    </Routes>
  )
}
