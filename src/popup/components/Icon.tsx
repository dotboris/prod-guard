import { Button } from "./Button";
import { type ButtonHTMLAttributes } from "react";
import { Link, type LinkProps } from "react-router";
import { omit, pick } from "lodash-es";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils";

const variants = cva(
  "inline-block fill-current [&_svg]:inline-block [&_svg]:fill-current",
  {
    variants: {
      variant: {
        light: "text-white hover:text-amber-300 active:text-amber-300",
        dark: "text-black hover:text-amber-700 active:text-amber-600",
      },
    },
  },
);

type IconProps = {
  title: string;
  svg: string;
  className?: string;
} & VariantProps<typeof variants>;

export function Icon({ className, variant, title, svg }: IconProps) {
  return (
    <span
      className={cn(className, variants({ variant }))}
      title={title}
      aria-label={title}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

export function IconButton(
  props: IconProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type">,
) {
  return (
    <Button
      className="bg-transparent p-0 text-black"
      {...nonIconProps(props)}
      type="button"
    >
      <Icon {...iconProps(props)} />
    </Button>
  );
}

export function IconLink(props: IconProps & LinkProps) {
  return (
    <Link {...nonIconProps(props)}>
      <Icon {...iconProps(props)} />
    </Link>
  );
}

function iconProps<T>(props: T & IconProps): IconProps {
  return pick(props, ["title", "svg", "variant", "className"]);
}

function nonIconProps<T extends object & IconProps>(
  props: T,
): Omit<T, keyof IconProps> {
  return omit(props, ["title", "svg", "variant", "className"]);
}
