import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderApplication } from "../../tests/render";
import { App } from "./app";

describe("foundation application", () => {
  it("runs without a backend and does not pretend business features exist", () => {
    renderApplication(<App backend={{ status: "not-configured" }} />);

    expect(screen.getByRole("heading", { name: "Projects and configurator" })).toBeInTheDocument();
    expect(screen.getByText("Convex is not configured")).toBeInTheDocument();
    expect(screen.getAllByText("Not implemented")).toHaveLength(3);
    expect(screen.getByText(/No sign-in provider is connected/)).toBeInTheDocument();
    expect(screen.getByText(/not a quotation tool/)).toBeInTheDocument();
  });

  it("shows invalid configuration instead of granting local access", () => {
    renderApplication(
      <App backend={{ status: "invalid", message: "Invalid public deployment configuration." }} />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Backend configuration error");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid public deployment configuration.");
  });

  it("distinguishes a configured URL from a healthy or authenticated connection", () => {
    renderApplication(
      <App backend={{ status: "configured", url: "https://example.convex.cloud" }} />,
    );
    expect(screen.getByText("Convex deployment configured")).toBeInTheDocument();
    expect(screen.getByText(/not a connection-health check/)).toBeInTheDocument();
    expect(screen.queryByText("Connected")).not.toBeInTheDocument();
  });

  it("switches the theme through the real Mantine provider", async () => {
    const user = userEvent.setup();
    renderApplication(<App backend={{ status: "not-configured" }} />);

    await user.click(screen.getByRole("button", { name: "Use dark theme" }));

    expect(document.documentElement).toHaveAttribute("data-mantine-color-scheme", "dark");
    expect(screen.getByRole("button", { name: "Use light theme" })).toBeInTheDocument();
  });
});
