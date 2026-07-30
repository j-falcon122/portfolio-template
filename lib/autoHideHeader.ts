/**
 * Pure helpers for site-header auto-hide behavior.
 * Used by `useAutoHideHeader` so apps can share logic without sharing markup/CSS.
 */

export type AutoHideHeaderMode = "near-top" | "scroll-direction";

export type NearTopVisibilityInput = {
  hasMounted: boolean;
  isAtTop: boolean;
  isMouseNearTop: boolean;
  isHeaderFocused: boolean;
};

/** Core template: visible at top of page, when the pointer is near the top, or while focused. */
export function isNearTopHeaderVisible(input: NearTopVisibilityInput): boolean {
  return (
    !input.hasMounted ||
    input.isAtTop ||
    input.isMouseNearTop ||
    input.isHeaderFocused
  );
}

export type ScrollDirectionState = {
  hidden: boolean;
  lastScrollY: number;
};

export type ScrollDirectionReduceOptions = {
  scrollDeltaPx: number;
  /** Treat as top-of-page (always show). Default 12. */
  topThresholdPx?: number;
  /** e.g. mobile menu open */
  forceVisible?: boolean;
  /**
   * When false, never hide (desktop). When undefined/true, scroll-direction
   * rules apply.
   */
  mediaMatches?: boolean;
};

/**
 * Falcon / mobile pattern: hide while scrolling down, show while scrolling up
 * (or when forced visible / outside the media query).
 */
export function reduceScrollDirectionHide(
  state: ScrollDirectionState,
  scrollY: number,
  opts: ScrollDirectionReduceOptions
): ScrollDirectionState {
  const topThreshold = opts.topThresholdPx ?? 12;

  if (opts.forceVisible || opts.mediaMatches === false) {
    return { hidden: false, lastScrollY: scrollY };
  }

  const delta = scrollY - state.lastScrollY;
  let hidden = state.hidden;

  if (scrollY <= topThreshold) {
    hidden = false;
  } else if (delta > opts.scrollDeltaPx) {
    hidden = true;
  } else if (delta < -opts.scrollDeltaPx) {
    hidden = false;
  }

  return { hidden, lastScrollY: scrollY };
}
