import { css } from '@emotion/react'
import { useState } from 'react'
import { trpc } from '../trpc'
import { fromZodIssue } from 'zod-validation-error'
import { useExpiringState } from './useExpiringState'
import { Button } from '../components/button'

const styles = {
  root: css({
    display: 'grid',
    gap: '0.5rem',
  }),
  textBox: css({
    height: '8rem',
  }),
  errors: css({
    ul: {
      margin: 0,
      paddingLeft: '1rem',
    },
  }),
}

export function ImportBox(): JSX.Element {
  const [data, setData] = useState('')
  const { doImport, isLoading, errors, importedRecently } = useImport()

  return (
    <form
      css={styles.root}
      onSubmit={(e) => {
        e.preventDefault()
        doImport(data)
      }}
    >
      <textarea
        disabled={isLoading}
        css={styles.textBox}
        onChange={(e) => {
          setData(e.target.value)
        }}
        value={data}
      />
      <Button type='submit' disabled={isLoading}>
        {importedRecently ? 'Imported!' : 'Import'}
      </Button>
      <Errors errors={errors} />
    </form>
  )
}

interface UseImport {
  doImport: (data: string) => void
  isLoading: boolean
  errors: string[]
  importedRecently: boolean
}

function useImport(): UseImport {
  const [importedRecently, setImportedRecently] = useExpiringState(false, 2000)
  const importMutation = trpc.importAllData.useMutation()

  const zodIssues = importMutation.error?.shape?.data.zodIssues ?? []
  let errors: string[] = []
  if (zodIssues.length > 0) {
    errors = zodIssues.map(
      (issue) => fromZodIssue(issue, { prefix: null }).message,
    )
  } else if (importMutation.error != null) {
    errors = [importMutation.error.message]
  }

  const [parseError, setParseError] = useState<string | null>(null)
  if (parseError != null) {
    errors.push(parseError)
  }

  return {
    doImport: (data: string) => {
      let allData
      try {
        allData = JSON.parse(data)
      } catch (error) {
        importMutation.reset()
        if (error instanceof Error) {
          setParseError(error.message)
        }
        return
      }

      importMutation.mutate(
        { allData },
        {
          onSuccess: () => {
            setImportedRecently(true)
          },
          onSettled: () => {
            setParseError(null)
          },
        },
      )
    },
    isLoading: importMutation.isLoading,
    errors,
    importedRecently,
  }
}

function Errors({ errors }: { errors: string[] }): JSX.Element | undefined {
  if (errors.length === 0) {
    return undefined
  }

  return (
    <div css={styles.errors}>
      Failed to import because of the following errors:
      <ul>
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  )
}
