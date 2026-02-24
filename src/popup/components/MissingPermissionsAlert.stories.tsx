import type { Meta, StoryObj } from "@storybook/react-webpack5";
import { MissingPermissionsAlert } from "./MissingPermissionsAlert";
import browser from "webextension-polyfill";
import { mocked } from "storybook/test";

const meta = {
  component: MissingPermissionsAlert,
} satisfies Meta<typeof MissingPermissionsAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const NoPermission: Story = {
  beforeEach: () => {
    mocked(browser, true).permissions.contains.mockResolvedValue(false);
  },
};

export const HasPermission: Story = {
  beforeEach: () => {
    mocked(browser, true).permissions.contains.mockResolvedValue(true);
  },
};

export const WithError: Story = {
  beforeEach: () => {
    mocked(browser, true).permissions.contains.mockRejectedValue(
      new Error("Mock error"),
    );
  },
};
