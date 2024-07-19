import path from "node:path";
import { defineConfig } from "@playwright/test";

const EXAMPLE_APP_DIR = path.resolve(import.meta.dirname, "e2e/example-app");

export default defineConfig({
  testDir: "e2e",
  testMatch: "e2e/*.test.ts",
  use: {
    trace: "on",
  },
  webServer: {
    command: `http-server ${EXAMPLE_APP_DIR} -p 7000`,
    url: "http://localhost:7000",
    reuseExistingServer: process.env.CI == null,
  },
});
