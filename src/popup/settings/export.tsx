import { useAsyncFn } from "react-use";
import { trpc } from "../trpc";
import { useExpiringState } from "./useExpiringState";
import { Button } from "../components/Button";
import { TextArea } from "../components/TextArea";

export default function ExportBox() {
  const { error, data } = trpc.exportAllData.useQuery();
  const formattedData = JSON.stringify(data, null, 2);

  return (
    <div className="grid gap-2">
      {error != null ? (
        <p>Failed to load data export: {error.message}</p>
      ) : null}
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
  const [state, doCopy] = useAsyncFn(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } finally {
      setCopiedRecently(true);
    }
  }, [text, setCopiedRecently]);

  let buttonText = "Copy to Clipboard";
  if (copiedRecently) {
    if (state.error == null) {
      buttonText = "Copied!";
    } else {
      buttonText = "Failed to Copy";
    }
  }

  return (
    <>
      <Button
        type="button"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={state.loading ? undefined : doCopy}
        disabled={state.loading}
      >
        {buttonText}
      </Button>
      {state.error != null ? <p>{state.error.message}</p> : null}
    </>
  );
}
