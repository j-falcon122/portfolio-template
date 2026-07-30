"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type FocusEvent,
} from "react";
import {
  isNearTopHeaderVisible,
  reduceScrollDirectionHide,
  type AutoHideHeaderMode,
  type ScrollDirectionState,
} from "./autoHideHeader";

export type UseAutoHideHeaderOptions = {
  /**
   * - `near-top` (default): hide after leaving the top; reveal when the pointer
   *   is near the top edge or the header is focused (portfolio-core template).
   * - `scroll-direction`: hide on scroll down within `mediaQuery`; reveal on
   *   scroll up, click/tap, or keydown (falcon mobile pattern).
   */
  mode?: AutoHideHeaderMode;
  /** Keep the header visible (e.g. open mobile menu). */
  forceVisible?: boolean;
  /** scroll-direction only applies while this media query matches. */
  mediaQuery?: string;
  /** near-top: pointer Y threshold in px. Default 72. */
  mouseRevealZonePx?: number;
  /** scroll-direction: minimum delta before toggling. Default 8. */
  scrollDeltaPx?: number;
};

export type UseAutoHideHeaderResult = {
  isAtTop: boolean;
  /** Whether the header chrome should be shown. */
  headerVisible: boolean;
  /** Spread onto `<header>` for near-top focus tracking (harmless no-ops otherwise). */
  headerFocusProps: {
    onFocusCapture: (event: FocusEvent<HTMLElement>) => void;
    onBlurCapture: (event: FocusEvent<HTMLElement>) => void;
  };
};

const DEFAULT_MEDIA_QUERY = "(max-width: 1100px)";

/**
 * Shared site-header visibility for template and derived portfolios.
 * Presentation (CSS / Tailwind) stays in each app; only the behavior is shared.
 */
export function useAutoHideHeader(
  options: UseAutoHideHeaderOptions = {}
): UseAutoHideHeaderResult {
  const mode = options.mode ?? "near-top";
  const forceVisible = Boolean(options.forceVisible);
  const mediaQuery = options.mediaQuery ?? DEFAULT_MEDIA_QUERY;
  const mouseRevealZonePx = options.mouseRevealZonePx ?? 72;
  const scrollDeltaPx = options.scrollDeltaPx ?? 8;

  const [isAtTop, setIsAtTop] = useState(true);
  const [isMouseNearTop, setIsMouseNearTop] = useState(false);
  const [isHeaderFocused, setIsHeaderFocused] = useState(false);
  const [directionHidden, setDirectionHidden] = useState(false);
  const scrollState = useRef<ScrollDirectionState>({
    hidden: false,
    lastScrollY: 0,
  });

  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (mode !== "near-top") return;

    const onScroll = () => setIsAtTop(window.scrollY <= 0);
    const onMouseMove = (event: MouseEvent) => {
      setIsMouseNearTop(event.clientY <= mouseRevealZonePx);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [mode, mouseRevealZonePx]);

  useEffect(() => {
    if (mode !== "scroll-direction") return;

    const mq = window.matchMedia(mediaQuery);
    scrollState.current = {
      hidden: false,
      lastScrollY: window.scrollY,
    };
    let ticking = false;

    const apply = (next: ScrollDirectionState) => {
      scrollState.current = next;
      setDirectionHidden(next.hidden);
      setIsAtTop(window.scrollY <= 0);
    };

    const updateFromScroll = () => {
      const y = window.scrollY;
      apply(
        reduceScrollDirectionHide(scrollState.current, y, {
          scrollDeltaPx,
          forceVisible,
          mediaMatches: mq.matches,
        })
      );
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        updateFromScroll();
        ticking = false;
      });
    };

    const reveal = () => {
      if (!mq.matches && !forceVisible) return;
      apply({ hidden: false, lastScrollY: window.scrollY });
    };

    const onMqChange = () => {
      if (!mq.matches) {
        apply({ hidden: false, lastScrollY: window.scrollY });
      }
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", reveal, { capture: true });
    window.addEventListener("keydown", reveal);
    mq.addEventListener("change", onMqChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", reveal, { capture: true });
      window.removeEventListener("keydown", reveal);
      mq.removeEventListener("change", onMqChange);
    };
  }, [mode, forceVisible, mediaQuery, scrollDeltaPx]);

  const onFocusCapture = useCallback(() => {
    setIsHeaderFocused(true);
  }, []);

  const onBlurCapture = useCallback((event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsHeaderFocused(false);
    }
  }, []);

  const headerVisible =
    mode === "near-top"
      ? isNearTopHeaderVisible({
          hasMounted,
          isAtTop,
          isMouseNearTop,
          isHeaderFocused,
        })
      : forceVisible || !directionHidden;

  return {
    isAtTop,
    headerVisible,
    headerFocusProps: {
      onFocusCapture,
      onBlurCapture,
    },
  };
}
