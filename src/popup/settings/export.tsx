import { useExpiringState } from "./useExpiringState";
import { Button } from "../components/Button";
import { TextArea } from "../components/TextArea";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loadState } from "../../state/storage";

export default function ExportBox() {
  const { data, isPending, error } = useQuery({
    queryKey: ["app"],
    queryFn: async () => {
      const state = await loadState();
      return state.exportAllData();
    },
  });

  if (isPending) {
    return; // should load very fast
  }

  if (error) {
    return <pre>Error: {error.stack ?? error.message}</pre>;
  }

  const formattedData = JSON.stringify(data, null, 2);
  return (
    <div className="grid gap-2">
      <TextArea
        className="h-32 font-mono leading-none"
        readOnly
        value={formattedData}
      />
      <CopyToClipboardButton text={formattedData} />
    </div>
  );
}

function CopyToClipboardButton({ text }: { text: string }) {
  const [copiedRecently, setCopiedRecently] = useExpiringState(false, 2000);
  const copyMutation = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await navigator.clipboard.writeText(text);
    },
    onSuccess: () => {
      setCopiedRecently(true);
    },
  });

  let buttonText = "Copy to Clipboard";
  if (copiedRecently) {
    if (copyMutation.error == null) {
      buttonText = "Copied!";
    } else {
      buttonText = "Failed to Copy";
    }
  }

  return (
    <>
      <Button
        type="button"
        onClick={() => copyMutation.mutate({ text })}
        disabled={copyMutation.isPending}
      >
        {buttonText}
      </Button>
      {copyMutation.error && <p>{copyMutation.error.message}</p>}
    </>
  );
}
