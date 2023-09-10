import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from 'react-query'
import { type Warning } from '../../warnings'
import {
  type GetAllWarningsApiCall,
  type GetWarningApiCall,
  type AddWarningApiCall,
  type UpdateWarningApiCall,
  type RemoveWarningApiCall,
} from '../../api'
import browser from 'webextension-polyfill'

export function useAllWarnings(): UseQueryResult<Warning[]> {
  return useQuery(
    'warnings',
    async () =>
      await (browser.runtime.sendMessage as GetAllWarningsApiCall)({
        type: 'getAllWarnings',
      })
  )
}

export function useWarning(id: string): UseQueryResult<Warning> {
  return useQuery(
    ['warnings', id],
    async () =>
      await (browser.runtime.sendMessage as GetWarningApiCall)({
        type: 'getWarning',
        id,
      })
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
      await (browser.runtime.sendMessage as AddWarningApiCall)({
        type: 'addWarning',
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

export function useUpdateWarningMutation(): UseMutationResult<
  void,
  Error,
  { id: string; warning: Warning }
> {
  const queryClient = useQueryClient()

  return useMutation(
    async (req) => {
      await (browser.runtime.sendMessage as UpdateWarningApiCall)({
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
      await (browser.runtime.sendMessage as RemoveWarningApiCall)({
        type: 'removeWarning',
        id: req.id,
      })
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries('warnings')
      },
    }
  )
}