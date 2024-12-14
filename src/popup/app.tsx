import WarningsListPage from "./warnings/list-page";
import NewWarningPage from "./warnings/new-page";
import EditWarningPage from "./warnings/edit-page";
import { Routes, Route } from "react-router";
import { Redirect } from "./redirect";
import SettingsPage from "./settings/settings-page";

export default function App() {
  return (
    <Routes>
      {/* The popup starts at /popup.html. We normalize that to / */}
      <Route path="/popup.html" element={<Redirect to="/" />} />
      <Route path="/" element={<WarningsListPage />} />
      <Route path="/new" element={<NewWarningPage />} />
      <Route path="/edit/:id" element={<EditWarningPage />} />

      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  );
}
