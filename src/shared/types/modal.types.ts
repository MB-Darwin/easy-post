export type ModalKey = string;

export type ModalOptions = {
  variant?: "default" | "fullscreen";
  overlay?: boolean;
  preventOutsideClose?: boolean;
  persistAs?: string | true;
  blockNavigation?: boolean;
  showCloseButton?: boolean;
  className?: string;
  keepOpenOnReload?: boolean;
  input?: unknown;
};

export type ModalInstance<P = unknown> = {
  id: string;
  key: ModalKey;
  props?: P;
  options?: ModalOptions;
  timestamp: number;
};

export type Restorable = {
  id: string;
  key: ModalKey;
  props?: unknown;
  options?: ModalOptions;
  timestamp: number;
};

export type ModalState = {
  stack: ModalInstance[];
  persisted: Record<string, unknown>;
  restoreQueue: Restorable[];
  isHydrated: boolean;
  isRestoring: boolean;

  open: <P = unknown>(
    key: ModalKey,
    props?: P,
    options?: ModalOptions
  ) => string;
  close: (id?: string) => void;
  closeAll: () => void;

  saveState: (key: string, state: unknown) => void;
  getState: (key: string) => unknown | undefined;
  clearState: (key: string) => void;

  restoreModals: () => void;
};

export type ModalBodyProps<T = unknown> = Record<string, unknown> & {
  id: string;
  close: () => void;
  saveState: (state: unknown) => void;
  input?: T;
};

export type ModalBodyComponent<
  P extends Record<string, unknown> = Record<string, never>
> = React.ComponentType<P & ModalBodyProps>;

export type ModalRegistry = Record<string, React.ComponentType<any>>;

export type ModalProviderConfig = {
  registry: ModalRegistry;
  onOpen?: (instance: ModalInstance) => void;
  onClose?: (instance: ModalInstance) => void;
  transitionMs?: number;
};
