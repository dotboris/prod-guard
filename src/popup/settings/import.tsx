import { css } from '@emotion/react'
import { useState } from 'react'
import { trpc } from '../trpc'
import { fromZodIssue } from 'zod-validation-error'
import { useExpiringState } from './useExpiringState'

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
  const [importedRecently, setImportedRecently] = useExpiringState(false, 2000)
  const [data, setData] = useState('')
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

  return (
    <form
      css={styles.root}
      onSubmit={(e) => {
        e.preventDefault()
        let allData
        try {
          allData = JSON.parse(data)
        } catch (error) {
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
              setData('')
            },
            onSettled: () => {
              setParseError(null)
            },
          },
        )
      }}
    >
      <textarea
        disabled={importMutation.isLoading}
        css={styles.textBox}
        onChange={(e) => {
          setData(e.target.value)
        }}
        value={data}
      />
      <button type='submit' disabled={importMutation.isLoading}>
        {importedRecently ? 'Imported!' : 'Import'}
      </button>
      <Errors errors={errors} />
    </form>
  )
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
