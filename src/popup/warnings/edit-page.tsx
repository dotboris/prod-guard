import Layout from '../layout'
import { useWarning, useUpdateWarningMutation } from './api-hooks'
import WarningForm from './form'
import { useParams, useNavigate } from 'react-router'
import { type Warning } from '../../warnings'

export default function EditWarningPage(): JSX.Element {
  const updateWarningMutation = useUpdateWarningMutation()

  const { id } = useParams()
  if (id == null) {
    throw new TypeError('Parameter id is required')
  }

  const { isLoading, data: warning } = useWarning(id)

  const navigate = useNavigate()
  const handleSave = async (warning: Warning): Promise<void> => {
    await updateWarningMutation.mutateAsync({ id, warning })
    navigate('/')
  }

  return (
    <Layout title='Edit Warning'>
      {!isLoading && warning != null ? (
        <WarningForm
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onSave={handleSave}
          value={warning}
        />
      ) : null}
    </Layout>
  )
}
