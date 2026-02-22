import browser from "webextension-polyfill";
import { loadState, setupState } from "../state/storage";

browser.runtime.onInstalled.addListener(() => {
  void setupState();
});

browser.tabs.onUpdated.addListener((tabId, _changeInfo, tab) => {
  void (async () => {
    if (tab.status !== "complete") {
      return;
    }

    if (tab.url === undefined) {
      return;
    }

    const state = await loadState();
    const warnings = state.findMatchingWarnings(tab.url);
    if (warnings.length > 0) {
      await browser.scripting.executeScript({
        target: { tabId },
        args: [warnings],
        func: (warnings) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
          (window as any).prodGuardWarnings = warnings;
        },
      });
      await browser.scripting.executeScript({
        target: { tabId },
        files: ["content-script.js"],
      });

      console.log(`Loaded content script into ${tab.url} (tabId: ${tabId})`);
    }
  })();
});
