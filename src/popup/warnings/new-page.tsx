import WarningForm from "./form";
import Layout from "../components/layout";
import { useNavigate } from "react-router";
import { type Warning } from "../../schema";
import { trpc } from "../trpc";

export default function NewWarningPage() {
  const addMutation = trpc.warnings.add.useMutation();

  const navigate = useNavigate();
  const handleSave = async (warning: Warning): Promise<void> => {
    await addMutation.mutateAsync({ warning });
    navigate("/");
  };

  return (
    <Layout title="New Warning">
      <WarningForm
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onSave={handleSave}
      />
    </Layout>
  );
}
