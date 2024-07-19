import { vi, test, describe, beforeEach, expect } from "vitest";
import browser from "webextension-polyfill";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WarningForm from "./form";
import { WarningStyle, type Warning } from "../../schema";

const browserMock = vi.mocked(browser, { deep: true });
vi.mock("webextension-polyfill", () => ({
  default: {
    tabs: {
      query: vi.fn(),
    },
  },
}));

beforeEach(() => {
  browserMock.tabs.query.mockResolvedValue([]);
});

describe("suggested pattern", () => {
  for (const style of Object.values(WarningStyle)) {
    describe(`when style=${style}`, () => {
      test("suggests pattern based on the current tab", async () => {
        browserMock.tabs.query.mockResolvedValue([
          {
            url: "https://dotboris.io/stuff",
            index: 0,
            active: true,
            highlighted: false,
            incognito: false,
            pinned: false,
          },
        ]);

        render(<WarningForm />);
        await userEvent.selectOptions(screen.getByLabelText("Style:"), [style]);

        expect(
          screen.getByLabelText<HTMLInputElement>("URL Regex:").value,
        ).toBe("dotboris\\.io");
      });
    });
  }
});

describe("border form", () => {
  test("submit defaults", async () => {
    let res: Warning | undefined;

    render(
      <WarningForm
        onSave={(newValue) => {
          res = newValue;
        }}
        value={undefined}
      />,
    );

    await userEvent.type(screen.getByLabelText("URL Regex:"), "url pattern");
    await userEvent.selectOptions(screen.getByLabelText("Style:"), ["border"]);
    await userEvent.click(screen.getByText("Save"));

    expect(res).toEqual({
      warningStyle: "border",
      pattern: "url pattern",
      enabled: true,
      borderColor: "FF0000",
    });
  });

  test("submit existing unchanged", async () => {
    let res: Warning | undefined;

    render(
      <WarningForm
        onSave={(newValue) => {
          res = newValue;
        }}
        value={{
          enabled: false,
          warningStyle: "border",
          pattern: "existing pattern",
          borderColor: "012",
        }}
      />,
    );

    await userEvent.click(screen.getByText("Save"));

    expect(res).toEqual({
      warningStyle: "border",
      pattern: "existing pattern",
      enabled: false,
      borderColor: "012",
    });
  });

  test("submit new fully changed", async () => {
    let res: Warning | undefined;

    render(
      <WarningForm
        onSave={(newValue) => {
          res = newValue;
        }}
        value={undefined}
      />,
    );

    await userEvent.selectOptions(screen.getByLabelText("Enabled:"), "false");
    await userEvent.type(screen.getByLabelText("URL Regex:"), "url pattern");
    await userEvent.selectOptions(screen.getByLabelText("Style:"), ["border"]);
    await userEvent.clear(screen.getByLabelText("Border Color:"));
    await userEvent.type(screen.getByLabelText("Border Color:"), "00FF00");
    await userEvent.click(screen.getByText("Save"));

    expect(res).toEqual({
      warningStyle: "border",
      pattern: "url pattern",
      enabled: false,
      borderColor: "00FF00",
    });
  });
});

for (const [title, style] of Object.entries({
  "top banner form": "topBanner",
  "bottom banner form": "bottomBanner",
} as const)) {
  describe(title, () => {
    test("submit defaults", async () => {
      let res: Warning | undefined;

      render(
        <WarningForm
          onSave={(newValue) => {
            res = newValue;
          }}
          value={undefined}
        />,
      );

      await userEvent.type(screen.getByLabelText("URL Regex:"), "url pattern");
      await userEvent.selectOptions(screen.getByLabelText("Style:"), [style]);
      await userEvent.click(screen.getByText("Save"));

      expect(res).toEqual({
        warningStyle: style,
        pattern: "url pattern",
        enabled: true,
        backgroundColor: "FF0000",
        text: "Warning! This is Production!",
        textColor: "FFFFFF",
      });
    });

    test("submit existing unchanged", async () => {
      let res: Warning | undefined;

      render(
        <WarningForm
          onSave={(newValue) => {
            res = newValue;
          }}
          value={{
            enabled: false,
            warningStyle: style,
            pattern: "existing pattern",
            text: "existing text",
            backgroundColor: "001",
            textColor: "002",
          }}
        />,
      );

      await userEvent.click(screen.getByText("Save"));

      expect(res).toEqual({
        warningStyle: style,
        pattern: "existing pattern",
        enabled: false,
        text: "existing text",
        backgroundColor: "001",
        textColor: "002",
      });
    });

    test("submit new fully filled", async () => {
      let res: Warning | undefined;

      render(
        <WarningForm
          onSave={(newValue) => {
            res = newValue;
          }}
          value={undefined}
        />,
      );

      await userEvent.selectOptions(screen.getByLabelText("Enabled:"), "false");
      await userEvent.type(screen.getByLabelText("URL Regex:"), "url pattern");
      await userEvent.selectOptions(screen.getByLabelText("Style:"), [style]);

      await userEvent.clear(screen.getByLabelText("Message:"));
      await userEvent.type(screen.getByLabelText("Message:"), "message");

      await userEvent.clear(screen.getByLabelText("Text Color:"));
      await userEvent.type(screen.getByLabelText("Text Color:"), "001");

      await userEvent.clear(screen.getByLabelText("Background Color:"));
      await userEvent.type(screen.getByLabelText("Background Color:"), "002");

      await userEvent.click(screen.getByText("Save"));

      expect(res).toEqual({
        warningStyle: style,
        pattern: "url pattern",
        enabled: false,
        text: "message",
        textColor: "001",
        backgroundColor: "002",
      });
    });
  });
}
