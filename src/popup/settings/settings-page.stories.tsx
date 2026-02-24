import type { Meta, StoryObj } from "@storybook/react-webpack5";

import SettingsPage from "./settings-page";
import { mocked } from "storybook/test";
import browser from "webextension-polyfill";
import { AllData } from "../../schema";

const meta = {
  component: SettingsPage,
  beforeEach: () => {
    mocked(browser, true).permissions.contains.mockResolvedValue(true);
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus1",
          warningStyle: "topBanner",
          enabled: true,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
        {
          id: "bogus2",
          warningStyle: "topBanner",
          enabled: false,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
        {
          id: "bogus3",
          warningStyle: "bottomBanner",
          enabled: true,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
        {
          id: "bogus4",
          warningStyle: "bottomBanner",
          enabled: false,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
        {
          id: "bogus5",
          warningStyle: "border",
          enabled: true,
          pattern: "example\\.com",
          borderColor: "FF8800",
        },
        {
          id: "bogus6",
          warningStyle: "border",
          enabled: false,
          pattern: "example\\.com",
          borderColor: "FF8800",
        },
      ],
    } satisfies AllData);
    mocked(browser, true).storage.sync.set.mockImplementation((data) => {
      alert("import: " + JSON.stringify(data, null, 2));
      return Promise.resolve();
    });
  },
} satisfies Meta<typeof SettingsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
