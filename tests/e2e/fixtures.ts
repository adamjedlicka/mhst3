import { test as base, expect } from "@playwright/test";

export { expect };

export const test = base.extend<{ isolatedBrowser: undefined }>({
  isolatedBrowser: [
    async ({ context, baseURL }, use) => {
      if (!baseURL) {
        throw new Error("E2E tests require a local baseURL.");
      }
      const allowedOrigin = new URL(baseURL).origin;
      const externalOrigins: string[] = [];
      const browserErrors: string[] = [];

      context.on("page", (page) => {
        page.on("pageerror", (error) => browserErrors.push(error.message));
      });
      await context.route("**/*", (route) => {
        const origin = new URL(route.request().url()).origin;
        if (origin !== allowedOrigin) {
          externalOrigins.push(origin);
          return route.abort();
        }
        return route.continue();
      });
      // This suite exercises the standalone production build, not a backend.
      await context.routeWebSocket(/.*/, (socket) => {
        externalOrigins.push(new URL(socket.url()).origin);
        socket.close();
      });

      await use(undefined);

      expect(externalOrigins, "No test may contact an external service").toEqual([]);
      expect(browserErrors, "No uncaught browser errors").toEqual([]);
    },
    { auto: true },
  ],
});
