import { afterEach, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => {
      throw new Error("Network requests are disabled in unit and backend tests.");
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});
