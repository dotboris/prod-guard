import { MissingPermissionsAlert } from "./MissingPermissionsAlert";
import { HouseIcon, SettingsIcon } from "lucide-react";
import { Button } from "./Button";
import { Link } from "react-router";

export interface LayoutProps {
  title: string;
}

export default function Layout({
  title,
  children,
}: React.PropsWithChildren<LayoutProps>) {
  return (
    <div data-testid="layout-root">
      <div className="sticky top-0 flex items-end gap-3 bg-slate-700 px-4 py-3 text-white">
        <Button className="p-0" asChild color="none">
          <Link to="/">
            <HouseIcon className="size-6" aria-label="Home" />
          </Link>
        </Button>

        <h1 className="m-0 grow text-2xl leading-none font-bold">{title}</h1>

        <Button className="p-0" asChild color="none">
          <Link to="/settings">
            <SettingsIcon className="size-6" aria-label="Settings" />
          </Link>
        </Button>
      </div>

      <div className="p-4">
        <MissingPermissionsAlert />
        {children}
      </div>
    </div>
  );
}
