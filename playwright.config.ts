import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

// Keep browser downloads inside the rewrite, not in the legacy dependencies.
process.env.PLAYWRIGHT_BROWSERS_PATH ??= fileURLToPath(
  new URL("./.cache/ms-playwright", import.meta.url),
);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "bun run build && bun run preview --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
    timeout: 120_000,
    // Override local/CI dotenv values: E2E must never use a real deployment.
    env: { VITE_CONVEX_URL: "" },
  },
});
