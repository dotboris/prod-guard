import WarningForm from './form'
import Layout from '../layout'
import { useAddWarningMutation } from './api-hooks'
import { useNavigate } from 'react-router'
import { type Warning } from '../../warnings'

export default function NewWarningPage(): JSX.Element {
  const addWarningMutation = useAddWarningMutation()

  const navigate = useNavigate()
  const handleSave = async (warning: Warning): Promise<void> => {
    await addWarningMutation.mutateAsync({ warning })
    navigate('/')
  }

  return (
    <Layout title='New Warning'>
      <WarningForm
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSave={handleSave}
      />
    </Layout>
  )
}
