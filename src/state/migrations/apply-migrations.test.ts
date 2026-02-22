import { describe, it, expect } from "vitest";
import { applyMigrations } from "./apply-migrations";
import { ZodError } from "zod";

// We're playing a little wild and loose with the types here. The linter doesn't
// like `any` which is fair but in this context, lining up the types a ton of
// work so we turn these off.
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */

describe("applyMigrations()", () => {
  it("should return input data with no migrations", () => {
    const storageData = {
      test: 1,
      foo: "bar",
    };

    const [hasMigrated, res] = applyMigrations([], storageData);

    expect(hasMigrated).toBe(false);
    expect(res).toEqual({
      dataVersion: 0,
      test: 1,
      foo: "bar",
    });
  });

  it("should apply all migrations when starting from scratch", () => {
    const storageData = {};
    const migrations = [
      () => ({ list: [] }),
      (data: any) => ({ ...data, thing: true }),
      (data: { list: any }) => ({ ...data, list: [...data.list, 42] }),
      (data: { list: any }) => ({ ...data, list: [...data.list, 43] }),
    ];

    const [hasMigrated, res] = applyMigrations(migrations, storageData);

    expect(hasMigrated).toBe(true);
    expect(res).toEqual({
      dataVersion: 4,
      list: [42, 43],
      thing: true,
    });
  });

  it("should apply only new migrations when starting in the middle", () => {
    const storageData = { dataVersion: 3 };
    const migrations = [
      () => ({ zero: true }),
      (data: any) => ({ ...data, one: true }),
      (data: any) => ({ ...data, two: true }),
      (data: any) => ({ ...data, three: true }),
      (data: any) => ({ ...data, four: true }),
      (data: any) => ({ ...data, five: true }),
    ];

    const [hasMigrated, res] = applyMigrations(migrations, storageData);

    expect(hasMigrated).toBe(true);
    expect(res).toEqual({
      dataVersion: 6,
      three: true,
      four: true,
      five: true,
    });
  });

  it("should crash when dataVersion is garbage", () => {
    expect(() => applyMigrations([], { dataVersion: "garbage" })).toThrow(
      ZodError,
    );
  });
});
