import "@testing-library/jest-dom/vitest";

import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

const nativeGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = (element) => nativeGetComputedStyle(element);
window.HTMLElement.prototype.scrollIntoView = vi.fn();

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn(
    (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => false),
    }),
  ),
});

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn<ResizeObserver["observe"]>();
  unobserve = vi.fn<ResizeObserver["unobserve"]>();
  disconnect = vi.fn<ResizeObserver["disconnect"]>();
}

Object.defineProperty(window, "ResizeObserver", {
  configurable: true,
  writable: true,
  value: ResizeObserverMock,
});

if (!document.fonts) {
  Object.defineProperty(document, "fonts", {
    value: { addEventListener: vi.fn(), removeEventListener: vi.fn() },
  });
}

afterEach(() => {
  cleanup();
  localStorage.clear();
});
