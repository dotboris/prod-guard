import type { Browser } from "webextension-polyfill";
import { fn } from "@vitest/spy";

function stub() {
  return fn().mockRejectedValue(new Error("TODO: mock me!"));
}

function stubEvent() {
  return {
    addListener: fn(() => {
      throw new Error("TODO: mock me!");
    }),
    removeListener: fn(() => {
      throw new Error("TODO: mock me!");
    }),
    hasListener: fn(() => {
      throw new Error("TODO: mock me!");
    }),
  };
}

function stubStorage() {
  return {
    onChanged: stubEvent(),
    get: stub(),
    getBytesInUse: stub(),
    getKeys: stub(),
    set: stub(),
    remove: stub(),
    clear: stub(),
  };
}

/**
 * Manual mock of `webextension-polyfill` where all functions are implemented as
 * vitest spies. This is what storybook uses under the hood. So when used with
 * `mocked(...)` everything magically lines up.
 */
export default {
  permissions: {
    contains: stub(),
    getAll: stub(),
    remove: stub(),
    request: stub(),
    onAdded: stubEvent(),
    onRemoved: stubEvent(),
  },
  storage: {
    onChanged: stubEvent(),
    sync: stubStorage(),
    local: stubStorage(),
    managed: stubStorage(),
    session: stubStorage(),
  },
} satisfies Partial<Browser>;
