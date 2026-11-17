"use client";

import {
  RiEyeLine as ShowIcon,
  RiEyeOffLine as HideIcon,
} from "@remixicon/react";

import { usePrivacy } from "@/components/privacy/privacy-provider";
import { Button } from "@/components/ui/button";

export default function HideExpensesToggle() {
  const { hidden, toggle } = usePrivacy();
  const Icon = hidden ? ShowIcon : HideIcon;

  return (
    <Button
      aria-label="Hide amounts"
      aria-pressed={hidden}
      className="rounded-full size-14 sm:size-10"
      onClick={toggle}
      type="button"
      variant="outline"
    >
      <Icon aria-hidden="true" className="size-5 sm:size-4" />
    </Button>
  );
}
