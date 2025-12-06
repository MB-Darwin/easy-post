// ============================================================================
// stores/modal.store.ts - Lean modal store
// ============================================================================
"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  ModalInstance,
  ModalKey,
  ModalOptions,
  ModalState,
  Restorable,
} from "../types/modal.types";

const pickRestorableOptions = (o?: ModalOptions): ModalOptions | undefined => {
  if (!o) {
    return undefined;
  }
  const {
    variant,
    overlay,
    preventOutsideClose,
    blockNavigation,
    showCloseButton,
    className,
    persistAs,
    keepOpenOnReload,
  } = o;
  return {
    variant,
    overlay,
    preventOutsideClose,
    blockNavigation,
    showCloseButton,
    className,
    persistAs,
    keepOpenOnReload,
  };
};

const genId = (): string =>
  globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);

const autoStorageKey = (
  modalKey: ModalKey,
  custom?: string | true
): string | undefined => {
  if (custom === true) {
    return `modal-${modalKey}`;
  }
  if (typeof custom === "string") {
    return custom;
  }
  return undefined;
};

export const useModalStore = create<ModalState>()(
  persist(
    (set, get) => ({
      stack: [],
      persisted: {},
      restoreQueue: [],
      isHydrated: false,
      isRestoring: false,

      open: (key, props, options) => {
        const id = genId();

        // Auto-enable persistAs when keepOpenOnReload is true
        const effectiveOptions: ModalOptions | undefined =
          options?.keepOpenOnReload && !options.persistAs
            ? { ...options, persistAs: true as const }
            : options;

        // Merge persisted props if available
        const storageKey = autoStorageKey(key, effectiveOptions?.persistAs);
        let finalProps = props;

        if (storageKey) {
          const saved = get().persisted[storageKey];
          if (saved && props) {
            finalProps = {
              ...(saved as object),
              ...(props as object),
            } as typeof props;
          } else if (saved) {
            finalProps = saved as typeof props;
          }
        }

        const instance: ModalInstance = {
          id,
          key,
          props: finalProps,
          options: effectiveOptions,
          timestamp: Date.now(),
        };

        // Single state update
        set((s) => {
          const newStack = [...s.stack, instance];

          const shouldQueue = effectiveOptions?.keepOpenOnReload === true;
          const newRestoreQueue = shouldQueue
            ? [
                ...s.restoreQueue.filter((r) => r.key !== key),
                {
                  id,
                  key,
                  props: finalProps,
                  options: pickRestorableOptions(effectiveOptions),
                  timestamp: instance.timestamp,
                },
              ]
            : s.restoreQueue;

          const newPersisted =
            storageKey && finalProps
              ? { ...s.persisted, [storageKey]: finalProps }
              : s.persisted;

          return {
            stack: newStack,
            restoreQueue: newRestoreQueue,
            persisted: newPersisted,
          };
        });

        return id;
      },

      close: (id) => {
        const { stack } = get();
        const closing = id
          ? stack.find((m) => m.id === id)
          : stack[stack.length - 1];

        if (!closing) {
          return;
        }

        set((s) => {
          const newStack = id
            ? s.stack.filter((m) => m.id !== id)
            : s.stack.slice(0, -1);

          const newRestoreQueue = s.restoreQueue.filter(
            (r) => r.key !== closing.key
          );

          const storageKey = closing.options?.persistAs
            ? autoStorageKey(closing.key, closing.options.persistAs)
            : undefined;

          const newPersisted =
            storageKey && closing.props
              ? { ...s.persisted, [storageKey]: closing.props }
              : s.persisted;

          return {
            stack: newStack,
            restoreQueue: newRestoreQueue,
            persisted: newPersisted,
          };
        });
      },

      closeAll: () => {
        const { stack } = get();

        set((s) => {
          let newPersisted = s.persisted;

          for (const m of stack) {
            if (m.options?.persistAs) {
              const storageKey = autoStorageKey(m.key, m.options.persistAs);
              if (storageKey && m.props) {
                newPersisted = { ...newPersisted, [storageKey]: m.props };
              }
            }
          }

          return {
            stack: [],
            restoreQueue: [],
            persisted: newPersisted,
          };
        });
      },

      // Generic persisted helpers
      saveState: (key, state) =>
        set((s) => ({ persisted: { ...s.persisted, [key]: state } })),

      getState: (key) => get().persisted[key],

      clearState: (key) =>
        set((s) => {
          const { [key]: removed, ...rest } = s.persisted;
          return { persisted: rest };
        }),

      // Re-open remembered modals after hydration
      restoreModals: () => {
        const { restoreQueue, isHydrated, isRestoring } = get();

        if (!isHydrated || !restoreQueue.length || isRestoring) {
          return;
        }

        set({ isRestoring: true });

        try {
          requestAnimationFrame(() => {
            const { open } = get();
            const currentQueue = [...restoreQueue];

            // Clear queue before opening to avoid duplication
            set({ restoreQueue: [], isRestoring: false });

            currentQueue.forEach((r: Restorable) => {
              open(r.key, r.props, r.options);
            });
          });
        } catch (e) {
          console.error("[ModalStore] Restore failed:", e);
          set({
            restoreQueue: [],
            isRestoring: false,
          });
        }
      },
    }),
    {
      name: "modal-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        persisted: state.persisted,
        restoreQueue: state.restoreQueue,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
          state.isRestoring = false;
        }
      },
    }
  )
);
