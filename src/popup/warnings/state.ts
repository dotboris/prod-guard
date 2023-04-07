import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from 'react-query'
import {
  addWarning,
  getAllWarnings,
  getWarning,
  removeWarning,
  updateWarning,
} from './warnings-client'
import { type Warning } from '../../warnings'
import { type WarningsApi } from '../../warnings-api'

export function useAllWarnings(): UseQueryResult<Warning[]> {
  return useQuery('warnings', async () => await getAllWarnings())
}

export function useWarning(id: string): UseQueryResult<Warning> {
  return useQuery(['warnings', id], async () => await getWarning({ id }))
}

export function useAddWarningMutation(): UseMutationResult<
  void,
  Error,
  Parameters<WarningsApi['addWarning']>[0]
> {
  const queryClient = useQueryClient()

  return useMutation(
    async (req) => {
      await addWarning(req)
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
  Parameters<WarningsApi['updateWarning']>[0]
> {
  const queryClient = useQueryClient()

  return useMutation(
    async (req) => {
      await updateWarning(req)
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
  Parameters<WarningsApi['removeWarning']>[0]
> {
  const queryClient = useQueryClient()

  return useMutation(
    async (req) => {
      await removeWarning(req)
    },
    {
      async onSuccess() {
        await queryClient.invalidateQueries('warnings')
      },
    }
  )
}
