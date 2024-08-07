import { test, expect } from "./fixtures";

test.beforeEach(async ({ page, popupUrl }) => {
  await page.goto(popupUrl);
});

test("add top banner warning", async ({ page }) => {
  // Click on New Warning
  await page.getByRole("link", { name: "New Warning" }).click();
  await expect(
    page.getByRole("heading", { name: "New Warning" }),
  ).toBeVisible();

  // Fill out the form & save
  await page.getByLabel("Enabled:").selectOption({ label: "Yes" });
  await page.getByLabel("URL Regex:").fill("http://localhost:7000");
  await page.getByLabel("Style:").selectOption({ label: "Top Banner" });
  await page.getByLabel("Message:").fill("Warning from E2E tests");
  await page.getByLabel("Text Color:").fill("FF0000");
  await page.getByLabel("Background Color:").fill("00FF00");

  await page.getByTestId("layout-root").click(); // unfocus any boxes for consistent screenshot
  await expect(page.getByTestId("layout-root")).toHaveScreenshot();

  await page.getByRole("button", { name: "Save" }).click();

  // Land on warnings list
  await expect(page.getByRole("heading", { name: "Prod Guard" })).toBeVisible();
  await expect(page.getByText("Warning from E2E tests")).toBeVisible();
  await expect(page.getByTestId("layout-root")).toHaveScreenshot();

  // Check if the warning actually gets rendered
  await page.goto("http://localhost:7000");
  await expect(page.getByText("Warning from E2E tests")).toBeVisible();
  await expect(page).toHaveScreenshot();
});

test("add bottom banner warning", async ({ page }) => {
  // Click on New Warning
  await page.getByRole("link", { name: "New Warning" }).click();
  await expect(
    page.getByRole("heading", { name: "New Warning" }),
  ).toBeVisible();

  // Fill out the form & save
  await page.getByLabel("Enabled:").selectOption({ label: "Yes" });
  await page.getByLabel("URL Regex:").fill("http://localhost:7000");
  await page.getByLabel("Style:").selectOption({ label: "Bottom Banner" });
  await page.getByLabel("Message:").fill("Warning from E2E tests");
  await page.getByLabel("Text Color:").fill("000000");
  await page.getByLabel("Background Color:").fill("FFFF00");

  await page.getByTestId("layout-root").click(); // unfocus any boxes for consistent screenshot
  await expect(page.getByTestId("layout-root")).toHaveScreenshot();

  await page.getByRole("button", { name: "Save" }).click();

  // Land on warnings list
  await expect(page.getByRole("heading", { name: "Prod Guard" })).toBeVisible();
  await expect(page.getByText("Warning from E2E tests")).toBeVisible();
  await expect(page.getByTestId("layout-root")).toHaveScreenshot();

  // Check if the warning actually gets rendered
  await page.goto("http://localhost:7000");
  await expect(page.getByText("Warning from E2E tests")).toBeVisible();
  await expect(page).toHaveScreenshot();
});

test("add border warning", async ({ page }) => {
  // Click on New Warning
  await page.getByRole("link", { name: "New Warning" }).click();
  await expect(
    page.getByRole("heading", { name: "New Warning" }),
  ).toBeVisible();

  // Fill out the form & save
  await page.getByLabel("Enabled:").selectOption({ label: "Yes" });
  await page.getByLabel("URL Regex:").fill("http://localhost:7000");
  await page.getByLabel("Style:").selectOption({ label: "Border" });
  await page.getByLabel("Border Color:").fill("FF8800");

  await page.getByTestId("layout-root").click(); // unfocus any boxes for consistent screenshot
  await expect(page.getByTestId("layout-root")).toHaveScreenshot();

  await page.getByRole("button", { name: "Save" }).click();

  // Land on warnings list
  await expect(page.getByText("http://localhost:7000")).toBeVisible();
  await expect(page.getByTestId("layout-root")).toHaveScreenshot();

  // Check if the warning actually gets rendered
  await page.goto("http://localhost:7000");
  await expect(page.getByText("Hello, world!")).toBeVisible();
  await expect(page).toHaveScreenshot();
});
