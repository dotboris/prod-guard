import Layout from "../components/Layout";
import ExportBox from "./export";
import { ImportBox } from "./import";

export default function SettingsPage() {
  return (
    <Layout title="Settings">
      <div className="grid gap-2">
        <h2 className="text-lg font-bold">Export All Data</h2>
        <ExportBox />

        <h2 className="text-lg font-bold">Import All Data</h2>
        <ImportBox />
      </div>
    </Layout>
  );
}
