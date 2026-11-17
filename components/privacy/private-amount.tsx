"use client";

import { cn } from "@/lib/utils";

import HiddenAmount from "./hidden-amount";
import { usePrivacy } from "./privacy-provider";
import PrivacyTransition from "./privacy-transition";

interface PrivateAmountProps {
  value: string;
  className?: string;
}

export default function PrivateAmount({
  value,
  className,
}: PrivateAmountProps) {
  const { hidden } = usePrivacy();

  return (
    <PrivacyTransition
      hidden={hidden}
      className={cn("inline-flex items-center", className)}
    >
      {hidden ? <HiddenAmount /> : value}
    </PrivacyTransition>
  );
}
