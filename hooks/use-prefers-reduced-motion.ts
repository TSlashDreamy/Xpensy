import * as React from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

export function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(QUERY);
    const onChange = () => setPrefersReducedMotion(mql.matches);

    mql.addEventListener("change", onChange);
    onChange(); // read the current value once mounted

    return () => mql.removeEventListener("change", onChange);
  }, []);

  return prefersReducedMotion;
}
