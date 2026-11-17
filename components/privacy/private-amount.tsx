"use client";

import { cn } from "@/lib/utils";
import { HIDDEN_AMOUNT_TEXT } from "@/shared/privacy";

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
      className={cn(
        "inline-flex items-center",
        hidden && "select-none",
        className,
      )}
    >
      {hidden ? (
        <>
          <span aria-hidden="true" className="blur-[0.15em]">
            {HIDDEN_AMOUNT_TEXT}
          </span>
          <span className="sr-only">Amount hidden</span>
        </>
      ) : (
        value
      )}
    </PrivacyTransition>
  );
}
