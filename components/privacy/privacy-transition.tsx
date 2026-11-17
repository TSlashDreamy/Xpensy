"use client";

import { cn } from "@/lib/utils";

import type { ReactNode } from "react";

interface PrivacyTransitionProps {
  hidden: boolean;
  children: ReactNode;
  className?: string;
}

export default function PrivacyTransition({
  hidden,
  children,
  className,
}: PrivacyTransitionProps) {
  return (
    <span
      key={hidden ? "hidden" : "visible"}
      className={cn(
        "transition-[opacity,scale] duration-180 ease-out starting:scale-95 starting:opacity-0 motion-reduce:transition-none motion-reduce:starting:scale-100 motion-reduce:starting:opacity-100",
        className,
      )}
    >
      {children}
    </span>
  );
}
