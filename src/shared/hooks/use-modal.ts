// ============================================================================
// hooks/use-modal.ts - Client hook
// ============================================================================
"use client";

import { useEffect } from "react";
import { useModalStore } from "../stores";

export function useModal() {
  const open = useModalStore((s) => s.open);
  const close = useModalStore((s) => s.close);
  const closeAll = useModalStore((s) => s.closeAll);
  const stack = useModalStore((s) => s.stack);
  const saveState = useModalStore((s) => s.saveState);
  const getState = useModalStore((s) => s.getState);
  const clearState = useModalStore((s) => s.clearState);

  // Block page unload if any open modal requests it
  useEffect(() => {
    const blocking = stack.some((m) => m.options?.blockNavigation);
    if (!blocking) {
      return;
    }

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  });

  // Convenience: open with persisted key
  function openPersisted<P = unknown>(
    key: string,
    props?: P,
    customName?: string
  ): string {
    return open(key, props, { persistAs: customName || true });
  }

  return {
    open,
    openPersisted,
    close,
    closeAll,
    stack,
    saveState,
    getState,
    clearState,
  };
}
