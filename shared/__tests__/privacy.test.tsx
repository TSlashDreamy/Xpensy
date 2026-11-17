import { beforeEach, describe, expect, it } from "vitest";

import {
  HIDE_AMOUNTS_COOKIE,
  isHiddenAmountsCookie,
  serializeHiddenCookie,
  writeHiddenCookie,
} from "../privacy";

beforeEach(() => {
  document.cookie = `${HIDE_AMOUNTS_COOKIE}=; Max-Age=0; Path=/`;
});

describe("privacy cookie", () => {
  it("reads only the hidden value as hidden", () => {
    expect(isHiddenAmountsCookie("1")).toBe(true);
    expect(isHiddenAmountsCookie("0")).toBe(false);
    expect(isHiddenAmountsCookie(undefined)).toBe(false);
  });

  it("serializes a one-year Lax cookie", () => {
    expect(serializeHiddenCookie(true)).toBe(
      "xpensy-hide-amounts=1; Path=/; Max-Age=31536000; SameSite=Lax",
    );
  });

  it("writes the current preference to document.cookie", () => {
    writeHiddenCookie(true);
    expect(document.cookie).toContain("xpensy-hide-amounts=1");

    writeHiddenCookie(false);
    expect(document.cookie).toContain("xpensy-hide-amounts=0");
  });
});
