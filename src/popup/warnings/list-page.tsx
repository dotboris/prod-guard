import { warningStyles } from "./friendly-names";
import { IconButton, IconLink } from "../components/icon";
import EditIcon from "@fortawesome/fontawesome-free/svgs/solid/pen-to-square.svg";
import TrashIcon from "@fortawesome/fontawesome-free/svgs/solid/trash.svg";
import ToggleOnIcon from "@fortawesome/fontawesome-free/svgs/solid/toggle-on.svg";
import ToggleOffIcon from "@fortawesome/fontawesome-free/svgs/solid/toggle-off.svg";
import Layout from "../components/layout";
import { type WarningWithId } from "../../schema";
import { trpc } from "../trpc";
import { LinkButton } from "../components/button";

export default function WarningsListPage() {
  return (
    <Layout title="Prod Guard">
      <div className="mb-2 flex items-center">
        <h2 className="grow text-xl font-bold">Warnings</h2>
        <LinkButton to="/new">New Warning</LinkButton>
      </div>

      <WarningList />
    </Layout>
  );
}

function WarningList() {
  const { isLoading, data: warnings } = trpc.warnings.list.useQuery();

  if (isLoading || warnings == null) {
    return undefined;
  }

  if (warnings.length > 0) {
    return (
      <ul>
        {warnings.map((warning) => (
          <li
            key={warning.id}
            className="border-b border-b-gray-300 p-4 last:border-b-0 hover:bg-gray-50"
          >
            <WarningItem warning={warning} />
          </li>
        ))}
      </ul>
    );
  } else {
    return (
      <p className="py-12 text-center">
        There's nothing here.
        <br />
        Click on "New Warning" to get started.
      </p>
    );
  }
}

function WarningItem({ warning }: { warning: WarningWithId }) {
  const removeWarningMutation = trpc.warnings.remove.useMutation();
  const toggleWarningMutation = trpc.warnings.toggleEnabled.useMutation();

  return (
    <>
      <div className="mb-4 flex items-start gap-4 text-lg">
        <div className="grow self-center font-mono wrap-anywhere">
          {warning.pattern}
        </div>
        <IconButton
          svg={warning.enabled ? ToggleOnIcon : ToggleOffIcon}
          title={warning.enabled ? "Disable warning" : "Enable warning"}
          onClick={() => {
            toggleWarningMutation.mutate({ id: warning.id });
          }}
          theme="dark"
          size="1.5rem"
        />
        <IconLink
          to={`/edit/${warning.id}`}
          svg={EditIcon}
          title="Edit Warning"
          theme="dark"
          size="1.5rem"
        />
        <IconButton
          svg={TrashIcon}
          title="Delete Warning"
          onClick={() => {
            removeWarningMutation.mutate({ id: warning.id });
          }}
          theme="dark"
          size="1.5rem"
        />
      </div>
      <dl className="grid grid-cols-[min-content_1fr] gap-2">
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
    </>
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
