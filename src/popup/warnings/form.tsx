import browser from "webextension-polyfill";
import { useId } from "react";
import { type SubmitHandler, Controller, useForm } from "react-hook-form";
import ColorField from "../components/ColorField";
import { warningStyles } from "./friendly-names";
import {
  warningSchema,
  type BannerWarning,
  type BorderWarning,
  type Warning,
} from "../../schema";
import { Button } from "../components/Button";

export interface WarningFormProps {
  onSave?: (warning: Warning) => void;
  value?: Warning;
}

interface FormData {
  warningStyle: Warning["warningStyle"];
  pattern: Warning["pattern"];
  enabled: Warning["enabled"];
  borderColor?: BorderWarning["borderColor"];
  text?: BannerWarning["text"];
  textColor?: BannerWarning["textColor"];
  backgroundColor?: BannerWarning["backgroundColor"];
}

export default function WarningForm({ onSave, value }: WarningFormProps) {
  const { register, handleSubmit, control, watch } = useForm<FormData>({
    values: value,
    defaultValues: async () => ({
      warningStyle: "topBanner",
      pattern: (await guessPattern()) ?? "",
      enabled: true,
      borderColor: "FF0000",
      text: "Warning! This is Production!",
      textColor: "FFFFFF",
      backgroundColor: "FF0000",
    }),
  });

  const patternId = useId();
  const warningStyleId = useId();
  const enabledId = useId();
  const textId = useId();
  const borderColorId = useId();
  const backgroundColorId = useId();
  const textColorId = useId();

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (onSave != null) {
      const res = warningSchema.parse(data);
      onSave(res);
    }
  };

  return (
    <form
      className="grid grid-cols-[max-content_1fr] items-center gap-4 [&_label]:text-right"
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e);
      }}
    >
      <label htmlFor={enabledId}>Enabled:</label>
      <Controller
        name="enabled"
        control={control}
        render={({ field }) => (
          <select
            className="border border-black bg-no-repeat p-2"
            id={enabledId}
            {...field}
            value={field.value ? "true" : "false"}
            onChange={(e) => {
              field.onChange(e.target.value === "true");
            }}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        )}
      />

      <label htmlFor={patternId}>URL Regex:</label>
      <input
        className="border border-black bg-no-repeat p-2"
        id={patternId}
        type="text"
        {...register("pattern", { required: true })}
      />

      <label htmlFor={warningStyleId}>Style:</label>
      <select
        className="border border-black bg-no-repeat p-2"
        id={warningStyleId}
        {...register("warningStyle", { required: true })}
      >
        {Object.entries(warningStyles).map(([key, name]) => (
          <option key={key} value={key}>
            {name}
          </option>
        ))}
      </select>

      {watch("warningStyle") === "border" ? (
        <>
          <label htmlFor={borderColorId}>Border Color:</label>
          <Controller
            name="borderColor"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ColorField
                id={borderColorId}
                value={value ?? ""}
                onChange={onChange}
                required
              />
            )}
          />
        </>
      ) : null}

      {["topBanner", "bottomBanner"].includes(watch("warningStyle")) ? (
        <>
          <label htmlFor={textId}>Message:</label>
          <input
            className="border border-black bg-no-repeat p-2"
            id={textId}
            type="text"
            {...register("text", { required: true })}
          />

          <label htmlFor={textColorId}>Text Color:</label>
          <Controller
            name="textColor"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ColorField
                id={textColorId}
                value={value ?? ""}
                onChange={onChange}
                required
              />
            )}
          />

          <label htmlFor={backgroundColorId}>Background Color:</label>
          <Controller
            name="backgroundColor"
            control={control}
            render={({ field: { value, onChange } }) => (
              <ColorField
                id={backgroundColorId}
                value={value ?? ""}
                onChange={onChange}
                required
              />
            )}
          />
        </>
      ) : null}

      <div className="col-span-2 flex justify-end">
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
}

/**
 * Guess the pattern using the browser API. We able to, we'll generate a pattern
 * based on the current tab's URL.
 */
async function guessPattern(): Promise<string | undefined> {
  const tabs = await browser.tabs.query({
    currentWindow: true,
    active: true,
  });

  if (tabs.length > 0 && tabs[0].url != null) {
    const url = new URL(tabs[0].url);
    return url.host.replace(/\./g, "\\.");
  }
}
