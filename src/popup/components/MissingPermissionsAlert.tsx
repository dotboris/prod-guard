import browser from "webextension-polyfill";
import { useAsyncFn } from "react-use";
import { Button } from "./Button";
import { useEffect } from "react";
import { TriangleAlertIcon } from "lucide-react";

const PERMISSIONS = {
  origins: ["*://*/*"],
};

export function MissingPermissionsAlert() {
  const [{ value: hasPermission, loading }, checkPermission] = useAsyncFn(
    async () => await browser.permissions.contains(PERMISSIONS),
  );
  useEffect(() => {
    void checkPermission();
  }, [checkPermission]);

  if (loading) {
    return;
  }

  if (hasPermission !== true) {
    return (
      <div className="mb-4 grid gap-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
        <p>
          <TriangleAlertIcon className="float-left mr-1 inline-block size-6 text-amber-700" />
          Prod Guard is missing an important permission that is required for it
          to function correctly. It needs the "Access data for all websites"
          permission. This permission is used to add warnings to webpages.
        </p>
        <p>
          To ensure that Prod Guard continues to work correctly, please click on
          the button below and grant the requested permission.
        </p>
        <Button
          className="m-auto block max-w-fit"
          onClick={() => {
            void (async () => {
              await browser.permissions.request(PERMISSIONS);
              await checkPermission();
            })();
          }}
        >
          Open Permission Prompt
        </Button>
      </div>
    );
  }
}
