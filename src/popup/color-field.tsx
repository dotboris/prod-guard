import { type ChangeEventHandler, useCallback, useState } from "react";
import { css } from "@emotion/react";
import { palette } from "./theme";

const styles = {
  root: css({
    position: "relative",

    input: {
      // Ensure that we can't type under the preview circle
      paddingRight: "2rem",
      // Hack: This allows for this field to take the full width when inside a
      // grid like the warning form. Technically this is a generic component and
      // so it doesn't belong here but it's only ever used in that grid so it's
      // not a problem now.
      width: "100%",
    },
  }),
  previewWrapper: css({
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    top: 0,
    bottom: 0,
    right: "0.5rem",
  }),
  preview: css({
    width: "1rem",
    height: "1rem",
    borderRadius: "50%",
    border: `1px solid ${palette.darkShade}`,
  }),
};

export interface ColorFieldProps {
  id?: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
  onChange: (value: string) => void;
}

export default function ColorField(props: ColorFieldProps): JSX.Element {
  const { id, value, disabled, required, onChange } = props;
  const [rawValue, setRawValue] = useState(value);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      const newValue = event.target.value;
      setRawValue(newValue);
      if (event.target.validity.valid) {
        onChange(newValue);
      }
    },
    [setRawValue, onChange],
  );

  return (
    <div css={styles.root}>
      <div css={styles.previewWrapper}>
        <div css={styles.preview} style={{ backgroundColor: `#${rawValue}` }} />
      </div>

      <input
        id={id}
        type="text"
        pattern="^[0-9a-fA-F]{3}|[0-9a-fA-F]{6}$"
        value={rawValue}
        disabled={disabled}
        required={required}
        onChange={handleChange}
      />
    </div>
  );
}
