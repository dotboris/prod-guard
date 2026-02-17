import Layout from "../components/Layout";
import ExportBox from "./export";
import { ImportBox } from "./import";

export default function SettingsPage() {
  return (
    <Layout title="Settings">
      <h2>Export All Data</h2>
      <ExportBox />

      <h2>Import All Data</h2>
      <ImportBox />
    </Layout>
  );
}
