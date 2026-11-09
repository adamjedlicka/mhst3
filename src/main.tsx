import "@mantine/core/styles.css";

import { ConvexReactClient } from "convex/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/app";
import { readBackendConfig } from "./app/backend-config";
import { ApplicationProviders } from "./app/providers";

const backend = readBackendConfig(import.meta.env.VITE_CONVEX_URL);
const convex = backend.status === "configured" ? new ConvexReactClient(backend.url) : null;
const root = document.getElementById("root");

if (!root) {
  throw new Error("The application root element is missing.");
}

createRoot(root).render(
  <StrictMode>
    <ApplicationProviders convex={convex}>
      <App backend={backend} />
    </ApplicationProviders>
  </StrictMode>,
);
