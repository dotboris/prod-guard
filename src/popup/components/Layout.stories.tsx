import type { Meta, StoryObj } from "@storybook/react-webpack5";
import Layout from "./Layout";
import browser from "webextension-polyfill";
import { mocked } from "storybook/test";

const meta = {
  component: Layout,
} satisfies Meta<typeof Layout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Example",
    children: "Example content",
  },
  beforeEach: () => {
    mocked(browser, true).permissions.contains.mockResolvedValue(true);
  },
};

export const NoPermission: Story = {
  args: {
    title: "Missing Permissions",
    children: "Example content",
  },
  beforeEach: () => {
    mocked(browser, true).permissions.contains.mockResolvedValue(false);
  },
};
