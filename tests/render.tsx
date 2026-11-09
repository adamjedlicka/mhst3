import { render } from "@testing-library/react";
import type { ReactNode } from "react";
import { ApplicationProviders } from "../src/app/providers";

export function renderApplication(ui: ReactNode) {
  return render(<ApplicationProviders convex={null}>{ui}</ApplicationProviders>);
}
