"use client";

import * as React from "react";

const PortalContainerContext = React.createContext<HTMLElement | null>(null);

export function usePortalContainer() {
  return React.useContext(PortalContainerContext);
}

export function PortalContainerProvider({
  container,
  children,
}: {
  container: HTMLElement | null;
  children: React.ReactNode;
}) {
  return (
    <PortalContainerContext.Provider value={container}>
      {children}
    </PortalContainerContext.Provider>
  );
}
