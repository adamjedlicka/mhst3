import type { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";
import type { QueryCtx } from "../_generated/server";

/**
 * Provider-neutral identity check only, not an application authorization policy.
 * Future business functions also need explicit project/role/capability checks.
 */
export async function requireIdentity(ctx: Pick<QueryCtx, "auth">): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHENTICATED",
      message: "Sign in before accessing protected data.",
    });
  }
  return identity;
}
