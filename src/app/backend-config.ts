export type BackendConfig =
  | { status: "not-configured" }
  | { status: "configured"; url: string }
  | { status: "invalid"; message: string };

const invalidUrlMessage =
  "VITE_CONVEX_URL must be an HTTP(S) deployment URL, not an HTTP Actions (.convex.site) URL, and must not contain credentials, paths, query parameters or fragments.";

/** Public configuration only. A valid URL is not evidence of a healthy or authenticated backend. */
export function readBackendConfig(value: string | undefined): BackendConfig {
  const trimmed = value?.trim();
  if (!trimmed) {
    return { status: "not-configured" };
  }

  try {
    const url = new URL(trimmed);
    if (
      !["http:", "https:"].includes(url.protocol) ||
      url.hostname.endsWith(".convex.site") ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash
    ) {
      return { status: "invalid", message: invalidUrlMessage };
    }
    return { status: "configured", url: url.origin };
  } catch {
    // Never echo a potentially secret-containing invalid input into the UI.
    return { status: "invalid", message: invalidUrlMessage };
  }
}
