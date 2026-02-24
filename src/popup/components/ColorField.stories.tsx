import type { Meta, StoryObj } from "@storybook/react-webpack5";

import ColorField from "./ColorField";

const meta = {
  component: ColorField,
} satisfies Meta<typeof ColorField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "FF0000",
  },
};
