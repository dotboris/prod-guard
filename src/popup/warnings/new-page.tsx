import WarningForm from "./form";
import Layout from "../components/Layout";
import { useNavigate } from "react-router";
import { type Warning } from "../../schema";
import { useMutation } from "@tanstack/react-query";
import { loadState, saveState } from "../../state/storage";

export default function NewWarningPage() {
  const navigate = useNavigate();
  const addWarningMutation = useMutation({
    mutationFn: async ({ warning }: { warning: Warning }) => {
      const state = await loadState();
      state.addWarning(warning);
      await saveState(state);
    },
    onSuccess: async (data, variables, result, context) => {
      await context.client.invalidateQueries({ queryKey: ["app", "warnings"] });
      await navigate("/");
    },
  });

  return (
    <Layout title="New Warning">
      <WarningForm
        onSave={(warning) => addWarningMutation.mutate({ warning })}
      />
    </Layout>
  );
}
