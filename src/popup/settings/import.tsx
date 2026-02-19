import { useState } from "react";
import { trpc } from "../trpc";
import { fromZodIssue } from "zod-validation-error";
import { useExpiringState } from "./useExpiringState";
import { Button } from "../components/Button";
import { allDataSchema } from "../../schema";
import { TextArea } from "../components/TextArea";

export function ImportBox() {
  const [data, setData] = useState("");
  const { doImport, isLoading, errors, importedRecently } = useImport();

  return (
    <form
      className="grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        doImport(data);
      }}
    >
      <TextArea
        disabled={isLoading}
        className="h-32 font-mono leading-none"
        onChange={(e) => {
          setData(e.target.value);
        }}
        value={data}
      />
      <Button type="submit" disabled={isLoading}>
        {importedRecently ? "Imported!" : "Import"}
      </Button>
      <Errors errors={errors} />
    </form>
  );
}

interface UseImport {
  doImport: (data: string) => void;
  isLoading: boolean;
  errors: string[];
  importedRecently: boolean;
}

function useImport(): UseImport {
  const [importedRecently, setImportedRecently] = useExpiringState(false, 2000);
  const importMutation = trpc.importAllData.useMutation();

  const zodIssues = importMutation.error?.shape?.data.zodIssues ?? [];
  let errors: string[] = [];
  if (zodIssues.length > 0) {
    errors = zodIssues.map(
      (issue) => fromZodIssue(issue, { prefix: null }).message,
    );
  } else if (importMutation.error != null) {
    errors = [importMutation.error.message];
  }

  const [parseError, setParseError] = useState<string | null>(null);
  if (parseError != null) {
    errors.push(parseError);
  }

  return {
    doImport: (data: string) => {
      let allData;
      try {
        allData = allDataSchema.parse(JSON.parse(data));
      } catch (error) {
        importMutation.reset();
        if (error instanceof Error) {
          setParseError(error.message);
        }
        return;
      }

      importMutation.mutate(
        { allData },
        {
          onSuccess: () => {
            setImportedRecently(true);
          },
          onSettled: () => {
            setParseError(null);
          },
        },
      );
    },
    isLoading: importMutation.isLoading,
    errors,
    importedRecently,
  };
}

function Errors({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return undefined;
  }

  return (
    <div>
      Failed to import because of the following errors:
      <ul className="mt-2 list-disc pl-5">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}
