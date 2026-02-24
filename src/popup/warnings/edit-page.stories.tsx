import type { Meta, StoryObj } from "@storybook/react-webpack5";

import EditPage from "./edit-page";
import { mocked } from "storybook/test";
import browser from "webextension-polyfill";
import { AllData } from "../../schema";
import { Route, Routes } from "react-router";

const meta = {
  component: EditPage,
  decorators: (Story) => (
    <Routes location="/warnings/bogus">
      <Route path="/warnings/:id" element={<Story />} />
    </Routes>
  ),
  beforeEach: () => {
    mocked(browser, true).permissions.contains.mockResolvedValue(true);
  },
} satisfies Meta<typeof EditPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TopBanner: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "topBanner",
          enabled: true,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
      ],
    } satisfies AllData);
  },
};

export const BottomBanner: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "bottomBanner",
          enabled: true,
          pattern: "example\\.com",
          text: "Example Warning",
          backgroundColor: "FF8800",
          textColor: "FFFFFF",
        },
      ],
    } satisfies AllData);
  },
};

export const Border: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockResolvedValue({
      dataVersion: 4,
      warnings: [
        {
          id: "bogus",
          warningStyle: "border",
          enabled: true,
          pattern: "example\\.com",
          borderColor: "FF8800",
        },
      ],
    } satisfies AllData);
  },
};

export const ErrorState: Story = {
  beforeEach: () => {
    mocked(browser, true).storage.sync.get.mockRejectedValue(
      new Error("mock error"),
    );
  },
};
