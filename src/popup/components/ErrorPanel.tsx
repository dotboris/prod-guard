import { useMutation } from "@tanstack/react-query";
import { AlertCircleIcon, CheckIcon, ClipboardCopyIcon } from "lucide-react";
import { useExpiringState } from "./useExpiringState";

interface Props {
  error: Error;
}

export function ErrorPanel({ error }: Props) {
  const [copiedRecently, setCopiedRecently] = useExpiringState(false, 1000);
  const copyMutation = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      await navigator.clipboard.writeText(text);
    },
    onSuccess: () => {
      setCopiedRecently(true);
    },
  });
  return (
    <div className="grid gap-2 rounded border border-red-300 bg-red-100 p-4">
      <p className="text-red-800">
        <button
          className="float-right -mt-2 -mr-2 ml-1 inline-block cursor-pointer rounded-full p-2 transition hover:bg-red-200"
          onClick={() =>
            copyMutation.mutate({
              text: `${error.name}: ${error.message}\n${error.stack ?? ""}`,
            })
          }
        >
          {copiedRecently ? <CheckIcon /> : <ClipboardCopyIcon />}
        </button>
        <AlertCircleIcon className="mr-1 inline-block size-6" />
        <strong className="font-bold">{error.name}</strong>: {error.message}
      </p>
      <pre className="overflow-scroll rounded bg-red-50 p-2 font-mono text-sm">
        {error.stack ?? "No stack trace available"}
      </pre>
    </div>
  );
}
