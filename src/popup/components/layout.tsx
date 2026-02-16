import { IconLink } from "./icon";
import HomeIcon from "@fortawesome/fontawesome-free/svgs/solid/house-chimney.svg";
import GearIcon from "@fortawesome/fontawesome-free/svgs/solid/gear.svg";
import { type PropsWithChildren } from "react";
import { MissingPermissionsAlert } from "./missing-permissions-alert";

export interface LayoutProps {
  title: string;
}

export default function Layout({
  title,
  children,
}: PropsWithChildren<LayoutProps>) {
  return (
    <div data-testid="layout-root">
      <div className="sticky top-0 flex items-end gap-3 bg-slate-800 px-4 py-3 text-white">
        <IconLink
          to="/"
          svg={HomeIcon}
          title="Home"
          size="1.5rem"
          theme="light"
        />

        <h1 className="m-0 grow text-2xl leading-none font-bold">{title}</h1>

        <IconLink
          to="/settings"
          svg={GearIcon}
          title="Settings"
          size="1.5rem"
          theme="light"
        />
      </div>

      <div className="p-4">
        <MissingPermissionsAlert />
        {children}
      </div>
    </div>
  );
}
