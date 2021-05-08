import { navigate, useParams } from '@reach/router'
import React from 'react'
import Layout from '../layout'
import { useWarning, useUpdateWarningMutation } from './state'
import WarningForm from './form'

export default function EditWarningPage () {
  const updateWarningMutation = useUpdateWarningMutation()
  const { id: rawId } = useParams()
  const id = parseInt(rawId)
  const { isLoading, data: warning } = useWarning(id)

  async function handleSave (warning) {
    await updateWarningMutation.mutateAsync({ id, warning })
    navigate('/')
  }

  return (
    <Layout title='Edit Warning'>
      <WarningForm
        onSave={handleSave}
        value={warning}
        // Force re-render & state reset when we're done loading
        key={isLoading}
        disabled={isLoading}
      />
    </Layout>
  )
}
