import Layout from "../components/Layout";
import WarningForm from "./form";
import { useParams, useNavigate } from "react-router";
import { type Warning } from "../../schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loadState, saveState } from "../../state/storage";

export default function EditWarningPage() {
  const { id } = useParams();
  if (id == null) {
    throw new TypeError("Parameter id is required");
  }
  const {
    data: warning,
    isPending,
    error,
  } = useQuery({
    queryKey: ["app", "warnings", id],
    queryFn: async () => {
      const state = await loadState();
      return state.getWarning(id);
    },
  });

  const navigate = useNavigate();
  const updateWarningMutation = useMutation({
    mutationFn: async ({ id, warning }: { id: string; warning: Warning }) => {
      const state = await loadState();
      state.updateWarning(id, warning);
      await saveState(state);
    },
    onSuccess: async (data, variables, result, context) => {
      await context.client.invalidateQueries({ queryKey: ["app", "warnings"] });
      await navigate("/");
    },
  });

  if (isPending) {
    return <p>loading</p>; // todo pretty
  }

  if (error) {
    return <p>Error: {String(error)}</p>;
  }

  return (
    <Layout title="Edit Warning">
      <WarningForm
        onSave={(warning) => updateWarningMutation.mutate({ id, warning })}
        value={warning}
      />
    </Layout>
  );
}
