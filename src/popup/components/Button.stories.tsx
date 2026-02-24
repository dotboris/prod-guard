import { Meta, StoryObj } from "@storybook/react-webpack5";
import { Button } from "./Button";

const meta = {
  component: Button,
  args: {
    children: "Button",
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Danger: Story = {
  args: {
    color: "danger",
  },
};
