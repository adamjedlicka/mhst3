import { MantineProvider } from "@mantine/core";
import { ConvexProvider, type ConvexReactClient } from "convex/react";
import type { ReactNode } from "react";
import { theme } from "./theme";

interface ApplicationProvidersProps {
  children: ReactNode;
  convex: ConvexReactClient | null;
}

export function ApplicationProviders({ children, convex }: ApplicationProvidersProps) {
  const content = convex ? <ConvexProvider client={convex}>{children}</ConvexProvider> : children;

  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      {content}
    </MantineProvider>
  );
}
