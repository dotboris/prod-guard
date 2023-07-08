import browser from 'webextension-polyfill'
import { useQuery, useMutation, useQueryClient } from 'react-query'

export function useAllWarnings() {
  return useQuery(
    'warnings',
    async () => await browser.runtime.sendMessage({ type: 'getAllWarnings' }),
  )
}

export function useWarning(id) {
  return useQuery(
    ['warnings', id],
    async () => await browser.runtime.sendMessage({ type: 'getWarning', id }),
  )
}

export function useAddWarningMutation() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ warning }) => {
      return await browser.runtime.sendMessage({
        type: 'addWarning',
        warning,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('warnings')
      },
    },
  )
}

export function useUpdateWarningMutation() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id, warning }) => {
      return await browser.runtime.sendMessage({
        type: 'updateWarning',
        id,
        warning,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('warnings')
      },
    },
  )
}

export function useRemoveWarningMutation() {
  const queryClient = useQueryClient()

  return useMutation(
    async ({ id }) => {
      return await browser.runtime.sendMessage({
        type: 'removeWarning',
        id,
      })
    },
    {
      onSuccess() {
        queryClient.invalidateQueries('warnings')
      },
    },
  )
}
