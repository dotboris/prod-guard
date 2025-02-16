import { test as base, chromium, type BrowserContext } from "@playwright/test";
import path from "path";

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  popupUrl: string;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.join(import.meta.dirname, "../dist");
    const context = await chromium.launchPersistentContext("", {
      channel: "chromium", // enables headless mode
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (background == null) {
      background = await context.waitForEvent("serviceworker");
    }

    const extensionId = background.url().split("/")[2];
    await use(extensionId);
  },
  popupUrl: async ({ extensionId }, use) => {
    await use(`chrome-extension://${extensionId}/popup.html`);
  },
});

export const expect = test.expect;
