"use client";

import * as React from "react";

import { writeHiddenCookie } from "@/shared/privacy";

interface PrivacyContextValue {
  hidden: boolean;
  toggle: () => void;
}

const PrivacyContext = React.createContext<PrivacyContextValue | null>(null);

interface PrivacyProviderProps {
  initialHidden?: boolean;
  children: React.ReactNode;
}

export function PrivacyProvider({
  initialHidden = false,
  children,
}: PrivacyProviderProps) {
  const [hidden, setHiddenState] = React.useState(initialHidden);

  const toggle = React.useCallback(() => {
    const next = !hidden;
    setHiddenState(next);
    writeHiddenCookie(next);
  }, [hidden]);

  const value = React.useMemo(() => ({ hidden, toggle }), [hidden, toggle]);

  return (
    <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>
  );
}

export function usePrivacy(): PrivacyContextValue {
  const context = React.useContext(PrivacyContext);

  if (!context) {
    throw new Error("usePrivacy must be used within PrivacyProvider");
  }

  return context;
}
