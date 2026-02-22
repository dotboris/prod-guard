import { useExpiringState } from "./useExpiringState";
import { Button } from "../components/Button";
import { allDataSchema } from "../../schema";
import { TextArea } from "../components/TextArea";
import { useMutation } from "@tanstack/react-query";
import { loadState, saveState } from "../../state/storage";
import { ZodError } from "zod";

export function ImportBox() {
  const [importedRecently, setImportedRecently] = useExpiringState(false, 2000);
  const importMutation = useMutation({
    mutationFn: async ({ rawData }: { rawData: string | null }) => {
      if (!rawData) {
        throw new TypeError("Nothing to import");
      }

      const allData = allDataSchema.parse(JSON.parse(rawData));

      const state = await loadState();
      state.importAllData(allData);
      await saveState(state);
    },
    onSuccess: async (data, variables, result, context) => {
      await context.client.invalidateQueries({ queryKey: ["app"] });
      setImportedRecently(true);
    },
  });

  return (
    <form
      className="grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        importMutation.mutate({ rawData: formData.get("data") as string });
      }}
    >
      <TextArea
        name="data"
        disabled={importMutation.isPending}
        className="h-32 font-mono leading-none"
      />
      <Button type="submit" disabled={importMutation.isPending}>
        {importedRecently ? "Imported!" : "Import"}
      </Button>
      <Errors error={importMutation.error} />
    </form>
  );
}

function Errors({ error }: { error: Error | null }) {
  if (!error) {
    return;
  }

  const messages = [];
  if (error instanceof ZodError) {
    for (const issue of error.issues) {
      let message = `${issue.message} at ${issue.path.join(".")} (${issue.code})`;
      if (issue.input) {
        message += ` input=${JSON.stringify(issue.input)}`;
      }
      messages.push(message);
    }
  } else {
    messages.push(error.message);
  }

  return (
    <div>
      Failed to import because of the following errors:
      <ul className="mt-2 list-disc pl-5">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
