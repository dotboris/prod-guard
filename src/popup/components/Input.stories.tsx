import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Input } from "./Input";

const meta = {
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Text: Story = {
  args: {
    type: "text",
    value: "Hello World",
  },
};
