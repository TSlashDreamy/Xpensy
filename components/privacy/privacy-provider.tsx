"use client";

import * as React from "react";

import { writeHiddenCookie } from "@/shared/privacy";

interface PrivacyContextValue {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
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

  const setHidden = React.useCallback((next: boolean) => {
    setHiddenState(next);
    writeHiddenCookie(next);
  }, []);

  const toggle = React.useCallback(
    () => setHidden(!hidden),
    [hidden, setHidden],
  );

  const value = React.useMemo(
    () => ({ hidden, setHidden, toggle }),
    [hidden, setHidden, toggle],
  );

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
