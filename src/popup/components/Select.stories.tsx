import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { Select, SelectOption } from "./Select";

const meta = {
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select {...args}>
      <SelectOption>Pick something</SelectOption>
      <SelectOption value="foo">foo</SelectOption>
      <SelectOption value="bar">bar</SelectOption>
      <SelectOption value="baz">baz</SelectOption>
    </Select>
  ),
};
