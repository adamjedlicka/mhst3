import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "./_generated/api";
import { requireIdentity } from "./model/identity";
import schema from "./schema";

const modules = import.meta.glob([
  "./**/*.ts",
  "./_generated/*.js",
  "!./**/*.test.ts",
  "!./**/*.d.ts",
]);

describe("Convex foundation", () => {
  it("returns a public health response without business data", async () => {
    const t = convexTest(schema, modules);
    await expect(t.query(api.health.check)).resolves.toEqual({ status: "ok" });
  });

  it("rejects protected access without a verified identity", async () => {
    const t = convexTest(schema, modules);
    await expect(t.query((ctx) => requireIdentity(ctx))).rejects.toMatchObject({
      data: { code: "UNAUTHENTICATED" },
    });
  });

  it("uses the verified identity supplied by the backend context", async () => {
    const t = convexTest(schema, modules).withIdentity({
      issuer: "https://identity.example.test",
      subject: "synthetic-user",
    });
    const identity = await t.query((ctx) => requireIdentity(ctx));
    expect(identity).toMatchObject({
      issuer: "https://identity.example.test",
      subject: "synthetic-user",
    });
  });
});
