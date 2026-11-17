export const HIDE_AMOUNTS_COOKIE = "xpensy-hide-amounts";
export const HIDDEN_AMOUNT_TEXT = "#####";

const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function isHiddenAmountsCookie(value: string | undefined): boolean {
  return value === "1";
}

export function serializeHiddenCookie(hidden: boolean): string {
  return `${HIDE_AMOUNTS_COOKIE}=${hidden ? "1" : "0"}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function writeHiddenCookie(hidden: boolean): void {
  if (typeof document === "undefined") return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${serializeHiddenCookie(hidden)}${secure}`;
}
