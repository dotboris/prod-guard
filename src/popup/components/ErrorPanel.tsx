import { AlertCircleIcon } from "lucide-react";

interface Props {
  error: Error;
}

export function ErrorPanel({ error }: Props) {
  return (
    <div className="grid gap-2 rounded border border-red-300 bg-red-100 p-4">
      <p className="text-red-800">
        <AlertCircleIcon className="mr-1 inline-block size-6" />
        <strong className="font-bold">{error.name}</strong>: {error.message}
      </p>
      <pre className="overflow-scroll rounded bg-red-50 p-2 font-mono text-sm">
        {error.stack ?? "No stack trace available"}
      </pre>
    </div>
  );
}
