import { useMutation } from "@tanstack/react-query";
import {
  AlertCircleIcon,
  CheckIcon,
  ClipboardCopyIcon,
  CornerDownRightIcon,
} from "lucide-react";
import { useExpiringState } from "./useExpiringState";
import { Fragment, useMemo } from "react";

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
  const causes = useMemo(() => {
    const res: Error[] = [];
    let cause = error.cause;
    while (cause && cause instanceof Error) {
      res.push(cause);
      cause = cause.cause;
    }
    return res;
  }, [error.cause]);
  const errorText = useMemo(() => {
    let res = `${error.name}: ${error.message}`;
    if (error.stack) {
      res += `\n${error.stack}`;
    }
    for (const cause of causes) {
      res += `\nCaused by ${cause.name}: ${cause.message}`;
      if (cause.stack) {
        res += `\n${cause.stack}`;
      }
    }
    return res;
  }, [error, causes]);
  return (
    <div className="grid gap-2 rounded-lg border border-red-300 bg-red-100 p-4">
      <p className="text-red-800">
        <button
          className="float-right -mt-2 -mr-2 ml-1 inline-block cursor-pointer rounded-full p-2 transition outline-none hover:bg-red-200 focus-visible:bg-red-200 focus-visible:ring-1 focus-visible:ring-amber-300"
          onClick={() => copyMutation.mutate({ text: errorText })}
          aria-label="Copy error to clipboard"
        >
          {copiedRecently ? (
            <CheckIcon className="size-6" />
          ) : (
            <ClipboardCopyIcon className="size-6" />
          )}
        </button>
        <AlertCircleIcon className="mr-1 inline-block size-6" />
        <strong className="font-bold">{error.name}</strong>: {error.message}
      </p>
      <StackTrace stack={error.stack} />
      {causes.map((cause, idx) => (
        <Fragment key={idx}>
          <p className="text-red-800">
            <CornerDownRightIcon
              className="mr-1 inline-block size-4"
              aria-label="Caused by"
              aria-hidden={false}
            />
            <strong className="font-bold">{cause.name}</strong>: {cause.message}
          </p>
          <StackTrace stack={cause.stack} />
        </Fragment>
      ))}
    </div>
  );
}

function StackTrace({ stack }: { stack?: string }) {
  return (
    <pre
      className="max-h-48 overflow-scroll rounded bg-red-50 p-2 font-mono text-sm"
      tabIndex={0}
    >
      {stack ?? "No stack trace available"}
    </pre>
  );
}
