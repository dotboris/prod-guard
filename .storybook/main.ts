import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  framework: "@storybook/react-webpack5",
  stories: ["../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  core: {
    disableTelemetry: true,
  },
  addons: [
    "@storybook/addon-webpack5-compiler-babel",
    {
      name: "@storybook/addon-styling-webpack",
      options: {
        rules: [
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader", "postcss-loader"],
          },
        ],
      },
    },
  ],
  webpackFinal: (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "webextension-polyfill": import.meta.resolve("./webextension-mock.ts"),
      };
    }
    return config;
  },
};
export default config;
