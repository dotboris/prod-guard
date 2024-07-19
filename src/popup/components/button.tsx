import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { palette } from "../theme";
import { Link } from "react-router-dom";

export const buttonStyle = css({
  appearance: "none",
  border: "none",
  backgroundColor: palette.darkShade,
  padding: "0.5rem 1rem",
  color: palette.lightShade,
  cursor: "pointer",
  textDecoration: "none",

  "&:hover, &:focus": {
    color: palette.main,
  },
});
export const Button = styled.button(buttonStyle);
export const LinkButton = styled(Link)(buttonStyle);
