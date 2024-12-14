import { type SerializedStyles, css } from "@emotion/react";
import { Button } from "./button";
import { type ButtonHTMLAttributes, type CSSProperties } from "react";
import { Link, type LinkProps } from "react-router";
import { omit, pick } from "lodash-es";
import { palette } from "../theme";

const styles = {
  icon: css({
    fill: "currentcolor",
    display: "inline-block",
    svg: {
      fill: "currentcolor",
      display: "inline-block",
      width: "var(--size)",
    },
  }),

  iconLight: css({
    color: "white",
    "&:hover, &:active": {
      color: palette.main,
    },
  }),
  iconDark: css({
    color: "black",
    "&:hover, &:active": {
      color: palette.darkAccent,
    },
  }),

  button: css({
    background: "none",
    padding: 0,
    color: "black",
  }),
};

interface IconProps {
  title: string;
  svg: string;
  theme: "light" | "dark";
  size?: string;
  className?: string;
}

interface IconRawStyle extends CSSProperties {
  "--size": string;
}

export function Icon({ title, svg, size, theme, className }: IconProps) {
  let themeCss: SerializedStyles;
  switch (theme) {
    case "light":
      themeCss = styles.iconLight;
      break;
    case "dark":
      themeCss = styles.iconDark;
      break;
  }

  const style: IconRawStyle = {
    "--size": size ?? "1rem",
  };

  return (
    <span
      css={css(styles.icon, themeCss)}
      className={className}
      style={style}
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
    <Button css={styles.button} {...nonIconProps(props)} type="button">
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
  return pick(props, ["title", "svg", "size", "theme", "className"]);
}

function nonIconProps<T extends object & IconProps>(
  props: T,
): Omit<T, keyof IconProps> {
  return omit(props, ["title", "svg", "size", "theme", "className"]);
}
