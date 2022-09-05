import React, { useCallback } from 'react'
import Layout from '../layout'
import { useWarning, useUpdateWarningMutation } from './state'
import WarningForm from './form'
import { useParams, useNavigate } from 'react-router'

export default function EditWarningPage () {
  const updateWarningMutation = useUpdateWarningMutation()
  const { id } = useParams()
  const { isLoading, data: warning } = useWarning(id)

  const navigate = useNavigate()
  const handleSave = useCallback(async warning => {
    await updateWarningMutation.mutateAsync({ id, warning })
    navigate('/')
  }, [updateWarningMutation, id, navigate])

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
