import type { Meta, StoryObj } from "@storybook/react-webpack5";
import Form from "./form";

const meta = {
  component: Form,
  args: {
    onSave: (w) => alert(JSON.stringify(w, null, 2)),
  },
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
