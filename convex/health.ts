import { v } from "convex/values";
import { query } from "./_generated/server";

// Deliberately public and non-sensitive. Business endpoints must enforce access.
export const check = query({
  args: {},
  returns: v.object({ status: v.literal("ok") }),
  handler: () => ({ status: "ok" as const }),
});
