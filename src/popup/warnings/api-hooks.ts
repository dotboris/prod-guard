import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from 'react-query'
import { type Warning } from '../../warnings'
import { type ApiCallName, type ApiCall } from '../../api'
import browser from 'webextension-polyfill'

const sendMessage: ApiCall<ApiCallName> = browser.runtime.sendMessage

export function useAllWarnings(): UseQueryResult<Warning[]> {
  return useQuery(
    'warnings',
    async () => await sendMessage({ type: 'getAllWarnings' })
  )
}

export function useWarning(id: string): UseQueryResult<Warning> {
  return useQuery(
    ['warnings', id],
    async () => await sendMessage({ type: 'getWarning', id })
  )
}

export function useAddWarningMutation(): UseMutationResult<
  void,
  Error,
  { warning: Warning }
> {
  const queryClient = useQueryClient()

  return useMutation(
    async (req) => {
      await sendMessage({ type: 'addWarning', warning: req.warning })
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries('warnings')
      },
    }
  )
}

export function useUpdateWarningMutation(): UseMutationResult<
  void,
  Error,
  { id: string; warning: Warning }
> {
  const queryClient = useQueryClient()

  return useMutation(
    async (req) => {
      await sendMessage({
        type: 'updateWarning',
        id: req.id,
        warning: req.warning,
      })
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries('warnings')
      },
    }
  )
}

export function useRemoveWarningMutation(): UseMutationResult<
  void,
  Error,
  { id: string }
> {
  const queryClient = useQueryClient()

  return useMutation(
    async (req) => {
      await sendMessage({ type: 'removeWarning', id: req.id })
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries('warnings')
      },
    }
  )
}
