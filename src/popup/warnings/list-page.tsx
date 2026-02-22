import { warningStyles } from "./friendly-names";
import Layout from "../components/Layout";
import { type WarningWithId } from "../../schema";
import { Button } from "../components/Button";
import { Link } from "react-router";
import { Switch } from "../components/Switch";
import { TrashIcon, EditIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { loadState, saveState } from "../../state/storage";

export default function WarningsListPage() {
  return (
    <Layout title="Prod Guard">
      <div className="mb-4 flex items-center">
        <h2 className="grow pl-1 text-2xl font-bold">Warnings</h2>
        <Button asChild>
          <Link to="/new">New Warning</Link>
        </Button>
      </div>

      <WarningList />
    </Layout>
  );
}

function WarningList() {
  const {
    data: warnings,
    isPending,
    error,
  } = useQuery({
    queryKey: ["app", "warnings"],
    queryFn: async () => {
      const state = await loadState();
      return state.getAllWarnings();
    },
  });

  if (isPending) {
    return <p>loading</p>; // todo pretty
  }

  if (error) {
    return <p>Error: {String(error)}</p>;
  }

  if (warnings.length > 0) {
    return (
      <ul className="grid gap-4">
        {warnings.map((warning) => (
          <WarningItem key={warning.id} warning={warning} />
        ))}
      </ul>
    );
  } else {
    return (
      <p className="pt-12 pb-16 text-center text-neutral-600">
        There's nothing here.
        <br />
        Click on "New Warning" to get started.
      </p>
    );
  }
}

function WarningItem({ warning }: { warning: WarningWithId }) {
  const removeWarningMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const state = await loadState();
      state.removeWarning(id);
      await saveState(state);
    },
    onSuccess: async (data, variables, result, context) => {
      await context.client.invalidateQueries({ queryKey: ["app", "warnings"] });
    },
  });
  const toggleWarningMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const state = await loadState();
      state.toggleWarningEnabled(id);
      await saveState(state);
    },
    onSuccess: async (data, variables, result, context) => {
      await context.client.invalidateQueries({ queryKey: ["app", "warnings"] });
    },
  });

  return (
    <li className="grid gap-4 rounded-lg border border-neutral-300 p-4">
      <div className="flex items-center">
        <h3 className="grow font-mono text-lg leading-none wrap-anywhere">
          {warning.pattern}
        </h3>
        <Switch
          checked={warning.enabled}
          aria-label={warning.enabled ? "Disable warning" : "Enable warning"}
          onCheckedChange={() => {
            toggleWarningMutation.mutate({ id: warning.id });
          }}
        />
      </div>
      <dl className="grid grid-cols-[min-content_1fr] gap-2 leading-none">
        <dt>Style:</dt>
        <dd>{warningStyles[warning.warningStyle]}</dd>
        {warning.warningStyle === "border" ? (
          <>
            <dt>Color:</dt>
            <dd>
              <Color colorHex={warning.borderColor} />
            </dd>
          </>
        ) : null}
        {warning.warningStyle === "topBanner" ||
        warning.warningStyle === "bottomBanner" ? (
          <>
            <dt>Text:</dt>
            <dd>{warning.text}</dd>
            <dt>Color:</dt>
            <dd>
              <Color colorHex={warning.textColor} />
              {" on "}
              <Color colorHex={warning.backgroundColor} />
            </dd>
          </>
        ) : null}
      </dl>
      <div className="grid grid-cols-2 gap-4 text-center">
        <Button asChild>
          <Link
            className="flex items-center justify-center gap-1"
            to={`/edit/${warning.id}`}
          >
            Edit <EditIcon className="inline size-4" />
          </Link>
        </Button>
        <Button
          className="flex items-center justify-center gap-1"
          color="danger"
          onClick={() => {
            removeWarningMutation.mutate({ id: warning.id });
          }}
        >
          Delete <TrashIcon className="inline size-4" />
        </Button>
      </div>
    </li>
  );
}

function Color({ colorHex }: { colorHex: string }) {
  return (
    <span className="whitespace-nowrap">
      <span
        className="mr-1 inline-block size-2.5 border border-black align-baseline content-['']"
        style={{ backgroundColor: `#${colorHex}` }}
      />
      #{colorHex.toUpperCase()}
    </span>
  );
}
