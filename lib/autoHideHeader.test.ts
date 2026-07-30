import { describe, expect, it } from "vitest";
import {
  isNearTopHeaderVisible,
  reduceScrollDirectionHide,
} from "./autoHideHeader";

describe("isNearTopHeaderVisible", () => {
  it("stays visible before mount to avoid hydration flicker", () => {
    expect(
      isNearTopHeaderVisible({
        hasMounted: false,
        isAtTop: false,
        isMouseNearTop: false,
        isHeaderFocused: false,
      })
    ).toBe(true);
  });

  it("hides when scrolled away without mouse or focus", () => {
    expect(
      isNearTopHeaderVisible({
        hasMounted: true,
        isAtTop: false,
        isMouseNearTop: false,
        isHeaderFocused: false,
      })
    ).toBe(false);
  });

  it("shows at top, with mouse near top, or while focused", () => {
    expect(
      isNearTopHeaderVisible({
        hasMounted: true,
        isAtTop: true,
        isMouseNearTop: false,
        isHeaderFocused: false,
      })
    ).toBe(true);
    expect(
      isNearTopHeaderVisible({
        hasMounted: true,
        isAtTop: false,
        isMouseNearTop: true,
        isHeaderFocused: false,
      })
    ).toBe(true);
    expect(
      isNearTopHeaderVisible({
        hasMounted: true,
        isAtTop: false,
        isMouseNearTop: false,
        isHeaderFocused: true,
      })
    ).toBe(true);
  });
});

describe("reduceScrollDirectionHide", () => {
  const base = { hidden: false, lastScrollY: 0 };

  it("hides when scrolling down past the top threshold", () => {
    const next = reduceScrollDirectionHide(base, 40, {
      scrollDeltaPx: 8,
      mediaMatches: true,
    });
    expect(next.hidden).toBe(true);
    expect(next.lastScrollY).toBe(40);
  });

  it("shows when scrolling up", () => {
    const hidden = { hidden: true, lastScrollY: 120 };
    const next = reduceScrollDirectionHide(hidden, 90, {
      scrollDeltaPx: 8,
      mediaMatches: true,
    });
    expect(next.hidden).toBe(false);
  });

  it("always shows near the top of the page", () => {
    const hidden = { hidden: true, lastScrollY: 80 };
    expect(
      reduceScrollDirectionHide(hidden, 5, {
        scrollDeltaPx: 8,
        mediaMatches: true,
      }).hidden
    ).toBe(false);
  });

  it("never hides when forceVisible or media does not match", () => {
    expect(
      reduceScrollDirectionHide(base, 200, {
        scrollDeltaPx: 8,
        forceVisible: true,
        mediaMatches: true,
      }).hidden
    ).toBe(false);
    expect(
      reduceScrollDirectionHide(base, 200, {
        scrollDeltaPx: 8,
        mediaMatches: false,
      }).hidden
    ).toBe(false);
  });

  it("ignores tiny scroll deltas", () => {
    const mid = { hidden: false, lastScrollY: 100 };
    expect(
      reduceScrollDirectionHide(mid, 104, {
        scrollDeltaPx: 8,
        mediaMatches: true,
      }).hidden
    ).toBe(false);
  });
});
