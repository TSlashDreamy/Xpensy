import {
  render as rtlRender,
  type RenderOptions,
} from "@testing-library/react";

import { PrivacyProvider } from "@/components/privacy/privacy-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

import type { ReactElement, ReactNode } from "react";

export * from "@testing-library/react";

function Providers({ children }: { children: ReactNode }) {
  return (
    <PrivacyProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </PrivacyProvider>
  );
}

/** render() with the app-level providers that components assume are present. */
export function render(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return rtlRender(ui, { ...options, wrapper: Providers });
}
