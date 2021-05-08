import browser from 'webextension-polyfill'
import { useQuery, useMutation, useQueryClient } from 'react-query'

export function useAllWarnings () {
  return useQuery('warnings', async () =>
    await browser.runtime.sendMessage({ type: 'getAllSites' })
  )
}

export function useWarning (id) {
  return useQuery(['warnings', id], async () =>
    await browser.runtime.sendMessage({ type: 'getSite', id })
  )
}

export function useAddWarningMutation () {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ warning }) => {
      return await browser.runtime.sendMessage({
        type: 'addSite',
        site: warning
      })
    },
    {
      onSuccess () {
        queryClient.invalidateQueries('warnings')
      }
    }
  )
}

export function useUpdateWarningMutation () {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id, warning }) => {
      return await browser.runtime.sendMessage({
        type: 'updateSite',
        id,
        site: warning
      })
    },
    {
      onSuccess () {
        queryClient.invalidateQueries('warnings')
      }
    }
  )
}

export function useRemoveWarningMutation () {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      return await browser.runtime.sendMessage({
        type: 'removeSite',
        id
      })
    },
    {
      onSuccess () {
        queryClient.invalidateQueries('warnings')
      }
    }
  )
}
