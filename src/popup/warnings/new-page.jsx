import React from 'react'
import WarningForm from './form'
import Layout from '../layout'
import { useAddWarningMutation } from './state'
import { navigate } from '@reach/router'
import { useQuery } from 'react-query'

export default function NewWarningPage () {
  const {
    isLoading: isSuggestedPatternLoading,
    data: suggestedPattern
  } = useSuggestedPattern()
  const addWarningMutation = useAddWarningMutation()

  async function handleSave (warning) {
    await addWarningMutation.mutateAsync({ warning })
    navigate('/')
  }

  return (
    <Layout title='New Warning'>
      <WarningForm
        onSave={handleSave}
        value={{ pattern: suggestedPattern }}
        // Force full re-render when we have the suggested pattern
        key={isSuggestedPatternLoading}
        disabled={isSuggestedPatternLoading}
      />
    </Layout>
  )
}

function useSuggestedPattern () {
  return useQuery(
    'currentTab',
    async () => {
      const tabs = await browser.tabs.query({
        currentWindow: true,
        active: true
      })

      if (tabs.length > 0) {
        const url = new URL(tabs[0].url)
        return url.host.replace(/\./g, '\\.')
      } else {
        return null
      }
    },
    {
      // Disable caching for this query. Getting this information costs us
      // nothing. Having a wrong value in the cache is just going to cause
      // problems.
      cacheTime: 0
    }
  )
}
