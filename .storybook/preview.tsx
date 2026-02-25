import { Preview } from "@storybook/react-webpack5";

// Bypass check in `webextension-polyfill` that crash on load
declare global {
  interface Window {
    chrome: {
      runtime: {
        id: string;
      };
    };
  }
}
window.chrome = {
  runtime: {
    id: "bogus",
  },
};

import "../src/popup/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { MemoryRouter } from "react-router";

export default {
  decorators: (Story) => {
    const [queryClient] = useState(
      () =>
        new QueryClient({
          defaultOptions: {
            queries: {
              retry: false,
            },
          },
        }),
    );
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Story />
        </MemoryRouter>
      </QueryClientProvider>
    );
  },
} satisfies Preview;
