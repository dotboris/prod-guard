import Layout from '../layout'
import ExportBox from './export'

export default function SettingsPage(): JSX.Element {
  return (
    <Layout title='Settings'>
      <h2>Export All Data</h2>
      <ExportBox />
    </Layout>
  )
}
