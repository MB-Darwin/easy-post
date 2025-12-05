"use client";

import type { ReactNode, RefObject } from "react";
import { useEffect, useLayoutEffect, useRef } from "react";

// Types
type ScrollTarget = HTMLElement | Document;

type ScrollspyProps = {
  children: ReactNode;
  targetRef?: RefObject<ScrollTarget | null>;
  onUpdate?: (id: string) => void;
  offset?: number;
  smooth?: boolean;
  className?: string;
  dataAttribute?: string;
  history?: boolean;
};

type ScrollspyState = {
  prevId: string | null;
  anchors: Element[];
};

// SSR-safe layout effect
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Type guard for HTMLElement
function isHTMLElement(target: Window | HTMLElement): target is HTMLElement {
  return target !== window && "scrollTop" in target;
}

export function Scrollspy({
  children,
  targetRef,
  onUpdate,
  className,
  offset = 0,
  smooth = true,
  dataAttribute = "scrollspy",
  history = true,
}: ScrollspyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mutable state that doesn't trigger re-renders
  const stateRef = useRef<ScrollspyState>({
    prevId: null,
    anchors: [],
  });

  // Store latest callback ref to prevent stale closures
  const onUpdateRef = useRef(onUpdate);

  // Sync the callback ref in an effect (React Compiler compliant)
  useEffect(() => {
    onUpdateRef.current = onUpdate;
  });

  // Utility: Get the scroll target element
  function getScrollTarget(): Window | HTMLElement {
    const target = targetRef?.current;
    if (!target || target === document) return window;
    return target as HTMLElement;
  }

  // Utility: Get current scroll position
  function getScrollTop(): number {
    const target = getScrollTarget();

    if (isHTMLElement(target)) {
      return target.scrollTop;
    }

    return window.scrollY;
  }

  // Utility: Get scroll dimensions
  function getScrollDimensions(): {
    scrollHeight: number;
    clientHeight: number;
  } {
    const target = getScrollTarget();

    if (isHTMLElement(target)) {
      return {
        scrollHeight: target.scrollHeight,
        clientHeight: target.clientHeight,
      };
    }

    return {
      scrollHeight: document.documentElement.scrollHeight,
      clientHeight: window.innerHeight,
    };
  }

  // Utility: Check if scrolled to bottom
  function isAtBottom(): boolean {
    const { scrollHeight, clientHeight } = getScrollDimensions();
    return getScrollTop() + clientHeight >= scrollHeight - 2;
  }

  // Utility: Get offset for an anchor
  function getAnchorOffset(anchor: Element): number {
    const dataOffset = anchor.getAttribute(`data-${dataAttribute}-offset`);
    return dataOffset ? parseInt(dataOffset, 10) : offset;
  }

  // Core: Activate a section by ID
  function activateSection(sectionId: string | null, forceHashUpdate = false) {
    if (!sectionId) return;

    const { anchors, prevId } = stateRef.current;

    // Update data-active attributes using toggleAttribute
    for (const anchor of anchors) {
      const id = anchor.getAttribute(`data-${dataAttribute}-anchor`);
      anchor.toggleAttribute("data-active", id === sectionId);
    }

    // Fire callback
    onUpdateRef.current?.(sectionId);

    // Update URL hash
    if (history && (forceHashUpdate || prevId !== sectionId)) {
      window.history.replaceState(null, "", `#${sectionId}`);
    }

    stateRef.current.prevId = sectionId;
  }

  // Core: Find the currently active section
  function findActiveSection(): string | null {
    const { anchors } = stateRef.current;
    if (anchors.length === 0) return null;

    // Edge case: at bottom of container
    if (isAtBottom()) {
      const lastAnchor = anchors[anchors.length - 1];
      return lastAnchor?.getAttribute(`data-${dataAttribute}-anchor`) ?? null;
    }

    const scrollTop = getScrollTop();
    let activeIndex = 0;
    let minDelta = Infinity;

    for (let i = 0; i < anchors.length; i++) {
      const anchor = anchors[i];
      if (!anchor) continue;

      const sectionId = anchor.getAttribute(`data-${dataAttribute}-anchor`);

      if (!sectionId) continue;

      const section = document.getElementById(sectionId);
      if (!section) continue;

      const anchorOffset = getAnchorOffset(anchor);
      const sectionTop = section.offsetTop - anchorOffset;
      const delta = Math.abs(sectionTop - scrollTop);

      if (sectionTop <= scrollTop && delta < minDelta) {
        minDelta = delta;
        activeIndex = i;
      }
    }

    const activeAnchor = anchors[activeIndex];
    return activeAnchor?.getAttribute(`data-${dataAttribute}-anchor`) ?? null;
  }

  // Handler: Scroll event
  function handleScroll() {
    const activeId = findActiveSection();
    activateSection(activeId);
  }

  // Handler: Scroll to a section
  function scrollToSection(anchor: Element) {
    const sectionId = anchor
      .getAttribute(`data-${dataAttribute}-anchor`)
      ?.replace("#", "");

    if (!sectionId) return;

    const section = document.getElementById(sectionId);
    if (!section) return;

    const anchorOffset = getAnchorOffset(anchor);
    const target = getScrollTarget();

    target.scrollTo({
      top: section.offsetTop - anchorOffset,
      left: 0,
      behavior: smooth ? "smooth" : "auto",
    });

    activateSection(sectionId, true);
  }

  // Handler: Anchor click
  function handleAnchorClick(event: Event) {
    event.preventDefault();
    scrollToSection(event.currentTarget as Element);
  }

  // Handler: Scroll to URL hash
  function scrollToUrlHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    try {
      const escapedHash = CSS.escape(hash);
      const selector = `[data-${dataAttribute}-anchor="${escapedHash}"]`;
      const anchor = containerRef.current?.querySelector(selector);

      if (anchor) {
        scrollToSection(anchor);
      }
    } catch {
      // Invalid CSS selector, ignore
    }
  }

  // Effect: Setup and teardown
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Query and cache anchor elements
    const anchors = Array.from(
      container.querySelectorAll<Element>(`[data-${dataAttribute}-anchor]`)
    );
    stateRef.current.anchors = anchors;

    const scrollTarget = getScrollTarget();

    // Attach event listeners
    for (const anchor of anchors) {
      anchor.addEventListener("click", handleAnchorClick);
    }

    scrollTarget.addEventListener("scroll", handleScroll, { passive: true });

    // Initial state handling with requestAnimationFrame for better timing
    let frameId = requestAnimationFrame(() => {
      scrollToUrlHash();
      frameId = requestAnimationFrame(handleScroll);
    });

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      scrollTarget.removeEventListener("scroll", handleScroll);

      for (const anchor of anchors) {
        anchor.removeEventListener("click", handleAnchorClick);
      }

      stateRef.current.anchors = [];
    };
  }, [targetRef, dataAttribute, offset, smooth, history]);

  return (
    <div data-slot="scrollspy" className={className} ref={containerRef}>
      {children}
    </div>
  );
}
