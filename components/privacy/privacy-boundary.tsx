import { cookies } from "next/headers";

import { HIDE_AMOUNTS_COOKIE, isHiddenAmountsCookie } from "@/shared/privacy";

import { PrivacyProvider } from "./privacy-provider";

interface PrivacyBoundaryProps {
  cookiePromise: ReturnType<typeof cookies>;
  children: React.ReactNode;
}

export default async function PrivacyBoundary({
  cookiePromise,
  children,
}: PrivacyBoundaryProps) {
  const cookieStore = await cookiePromise;
  const hidden = isHiddenAmountsCookie(
    cookieStore.get(HIDE_AMOUNTS_COOKIE)?.value,
  );

  return <PrivacyProvider initialHidden={hidden}>{children}</PrivacyProvider>;
}
