// ============================================================================
// Provider.tsx - FIXED: All TypeScript errors resolved
// ============================================================================
"use client";
import * as React from "react";
import { ModalInstance, ModalKey } from "../types";
import { useModalStore } from "../stores";
import { Dialog } from "../components";

export type ModalBodyComponent<P = Record<string, unknown>> =
  React.ComponentType<
    P & {
      id: string;
      close: () => void;
      saveState: (state: unknown) => void; // ✅ Changed from any
      serverParams?: Record<string, unknown>;
    }
  >;

// ✅ Proper registry typing
export type ModalRegistry = Record<
  ModalKey,
  ModalBodyComponent<Record<string, unknown>>
>;

export type ModalProviderConfig = {
  registry: ModalRegistry;
  onOpen?: (instance: ModalInstance) => void;
  onClose?: (instance: ModalInstance) => void;
  transitionMs?: number;
};

export function ModalProvider({
  registry,
  onOpen,
  onClose,
  transitionMs = 200,
}: ModalProviderConfig) {
  const stack = useModalStore((s) => s.stack);
  const close = useModalStore((s) => s.close);
  const saveState = useModalStore((s) => s.saveState);
  const isHydrated = useModalStore((s) => s.isHydrated);
  const isRestoring = useModalStore((s) => s.isRestoring);

  const [mounted, setMounted] = React.useState(false);
  // ✅ Removed unused activeModals
  const prevStackRef = React.useRef<ModalInstance[]>([]);
  const hasRestoredRef = React.useRef(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted || !isHydrated || hasRestoredRef.current || isRestoring) {
      return;
    }

    hasRestoredRef.current = true;
    const timeoutId = setTimeout(() => {
      useModalStore.getState().restoreModals();
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [mounted, isHydrated, isRestoring]);

  React.useEffect(() => {
    if (!mounted) return;

    const prev = prevStackRef.current;
    const curr = stack;

    curr.forEach((inst) => {
      if (!prev.find((p) => p.id === inst.id)) {
        onOpen?.(inst);
      }
    });

    prev.forEach((inst) => {
      if (!curr.find((c) => c.id === inst.id)) {
        setTimeout(() => {
          onClose?.(inst);
        }, transitionMs);
      }
    });

    prevStackRef.current = curr;
  }, [stack, mounted, onOpen, onClose, transitionMs]);

  if (!mounted) return null;

  return (
    <>
      {stack.map((inst) => {
        const Body = registry[inst.key];
        if (!Body) {
          console.warn(
            `[ModalProvider] No component registered for key: ${inst.key}`
          );
          return null;
        }

        console.log({ first: inst });

        const overlay = inst.options?.overlay ?? true;
        const preventOutsideClose = inst.options?.preventOutsideClose ?? false;
        const showCloseButton = inst.options?.showCloseButton ?? true;
        const className = inst.options?.className ?? "";

        // ✅ Handle props properly
        const modalProps = inst.props || {};

        return (
          <Dialog
            key={inst.id}
            open
            onOpenChange={(open) => {
              if (!open) close(inst.id);
            }}
          >
            <Dialog.Content
              overlay={overlay}
              onInteractOutside={(e) => {
                if (preventOutsideClose) e.preventDefault();
              }}
              showCloseButton={showCloseButton}
              className={className}
            >
              <Body
                {...(modalProps as Record<string, unknown>)}
                id={inst.id}
                close={() => close(inst.id)}
                saveState={(state: unknown) => {
                  const storageKey = inst.options?.persistAs
                    ? typeof inst.options.persistAs === "string"
                      ? inst.options.persistAs
                      : `modal-${inst.key}`
                    : undefined;
                  if (storageKey) {
                    saveState(storageKey, state);
                  }
                }}
                serverParams={inst.options?.serverParams}
              />
            </Dialog.Content>
          </Dialog>
        );
      })}
    </>
  );
}
