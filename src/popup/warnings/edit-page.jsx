import { navigate, useParams } from '@reach/router'
import React, { useCallback } from 'react'
import Layout from '../layout'
import { useWarning, useUpdateWarningMutation } from './state'
import WarningForm from './form'

export default function EditWarningPage () {
  const updateWarningMutation = useUpdateWarningMutation()
  const { id: rawId } = useParams()
  const id = parseInt(rawId)
  const { isLoading, data: warning } = useWarning(id)

  const handleSave = useCallback(async warning => {
    await updateWarningMutation.mutateAsync({ id, warning })
    navigate('/')
  }, [updateWarningMutation, id])

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
