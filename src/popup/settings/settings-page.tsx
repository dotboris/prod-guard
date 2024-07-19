import Layout from "../components/layout";
import ExportBox from "./export";
import { ImportBox } from "./import";

export default function SettingsPage(): JSX.Element {
  return (
    <Layout title="Settings">
      <h2>Export All Data</h2>
      <ExportBox />

      <h2>Import All Data</h2>
      <ImportBox />
    </Layout>
  );
}
