import { describe, expect, it } from "vitest";
import { readBackendConfig } from "./backend-config";

describe("public backend configuration", () => {
  it.each([undefined, "", "  "])("allows standalone startup for %j", (value) => {
    expect(readBackendConfig(value)).toEqual({ status: "not-configured" });
  });

  it.each([
    [" https://example.convex.cloud/ ", "https://example.convex.cloud"],
    ["http://127.0.0.1:3210", "http://127.0.0.1:3210"],
  ])("normalizes a deployment URL without assuming connectivity: %s", (input, url) => {
    expect(readBackendConfig(input)).toEqual({ status: "configured", url });
  });

  it.each([
    "not a URL",
    "javascript:alert(1)",
    "file:///private",
    "https://example.convex.cloud/path",
    "https://example.convex.site",
    "https://example.convex.site/",
    "https://example.convex.cloud?token=not-a-real-secret",
    "https://example.convex.cloud#fragment",
    "https://user:password@example.convex.cloud",
  ])("rejects an invalid deployment URL: %s", (value) => {
    const result = readBackendConfig(value);
    expect(result.status).toBe("invalid");
    expect(JSON.stringify(result)).not.toContain(value);
  });
});
