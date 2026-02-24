import browser from "webextension-polyfill";
import { Button } from "./Button";
import { TriangleAlertIcon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";

const PERMISSIONS = {
  origins: ["*://*/*"],
};

export function MissingPermissionsAlert() {
  const {
    data: hasPermission,
    isPending,
    error,
  } = useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      return await browser.permissions.contains(PERMISSIONS);
    },
  });
  const requestMutation = useMutation({
    mutationFn: async () => {
      await browser.permissions.request(PERMISSIONS);
    },
    onSettled: async (data, error, variables, result, context) => {
      await context.client.invalidateQueries({ queryKey: ["permissions"] });
    },
  });

  if (isPending) {
    return null;
  }

  if (error) {
    return (
      <pre>
        Failed to check permission: {error.message}
        {"\n"}
        {error.stack}
      </pre>
    );
  }

  if (!hasPermission) {
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
          onClick={() => requestMutation.mutate()}
        >
          Open Permission Prompt
        </Button>
      </div>
    );
  }
}
