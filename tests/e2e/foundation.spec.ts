import { expect, test } from "./fixtures";

test("starts without credentials, external requests or browser errors", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("MHST — Projects and configurator");
  await expect(page.getByRole("heading", { name: "Projects and configurator" })).toBeVisible();
  await expect(page.getByText("Convex is not configured")).toBeVisible();
  await expect(page.getByText("Not implemented")).toHaveCount(3);
  await expect(page.getByText(/No sign-in provider is connected/)).toBeVisible();
});

test("supports a keyboard-accessible theme choice that survives reload", async ({ page }) => {
  await page.goto("/");
  const darkTheme = page.getByRole("button", { name: "Use dark theme" });
  await page.keyboard.press("Tab");
  await expect(darkTheme).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-mantine-color-scheme", "dark");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-mantine-color-scheme", "dark");
  await expect(page.getByRole("button", { name: "Use light theme" })).toBeVisible();
});

test("fits the viewport without horizontal scrolling", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Projects and configurator" })).toBeVisible();
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflows).toBe(false);
});
