import { Routes, Route } from "react-router";
import WarningsListPage from "./warnings/list-page";
import NewWarningPage from "./warnings/new-page";
import EditWarningPage from "./warnings/edit-page";
import SettingsPage from "./settings/settings-page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WarningsListPage />} />
      <Route path="/new" element={<NewWarningPage />} />
      <Route path="/edit/:id" element={<EditWarningPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
