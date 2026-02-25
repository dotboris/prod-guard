import type { Meta, StoryObj } from "@storybook/react-webpack5";

import { ErrorPanel } from "./ErrorPanel";

const meta = {
  component: ErrorPanel,
} satisfies Meta<typeof ErrorPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    error: new Error("oops"),
  },
};

export const CauseChain: Story = {
  args: {
    error: new Error("oops", {
      cause: new Error("i did", {
        cause: new Error("it again"),
      }),
    }),
  },
};

export const VeryLongError: Story = {
  args: {
    error: new Error("Oops, I did it again, I played with your heart"),
  },
};

function errorWithLongStack(depth: number) {
  const rec = (d: number): Error => {
    try {
      if (depth === 0) {
        throw new Error("oops");
      } else {
        return errorWithLongStack(depth - 1);
      }
    } catch (error) {
      if (!(error instanceof Error)) {
        throw new TypeError("unexpected error type");
      }
      if (d === depth) {
        return error;
      }
      throw error;
    }
    throw new Error("should not happen");
  };
  return rec(depth);
}

export const VeryLongStack: Story = {
  args: {
    error: errorWithLongStack(10),
  },
};
