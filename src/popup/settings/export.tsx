import { css } from "@emotion/react";
import { type JSX } from "react";
import { useAsyncFn } from "react-use";
import { trpc } from "../trpc";
import { useExpiringState } from "./useExpiringState";
import { Button } from "../components/button";

const styles = {
  root: css({
    display: "grid",
    gap: "0.5rem",
  }),
  textBox: css({
    height: "8rem",
  }),
};

export default function ExportBox(): JSX.Element | undefined {
  const { error, data } = trpc.exportAllData.useQuery();
  const formattedData = JSON.stringify(data, null, 2);

  return (
    <div css={styles.root}>
      {error != null ? (
        <p>Failed to load data export: {error.message}</p>
      ) : null}
      <textarea css={styles.textBox} readOnly value={formattedData} />
      <CopyToClipboardButton text={formattedData} />
    </div>
  );
}

function CopyToClipboardButton({ text }: { text: string }): JSX.Element {
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
