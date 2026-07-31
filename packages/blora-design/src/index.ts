/**
 * Blora Design 2.0 package entry point.
 *
 * This modern ESM entry is side-effect free and safe to import during SSR.
 * The version is injected from package.json by Vite.
 *
 * @packageDocumentation
 */

export const VERSION: string = __BLORA_VERSION__;

/** SSR-safe check for a browser environment. */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

// Core
export { BloraElement } from "./core/blora-element.js";

// Controllers
export { OverlayController, type OverlayOptions } from "./controllers/overlay-controller.js";

// Component helpers
export { setButtonLoading, type ButtonLoadingOptions } from "./components/button/index.js";

// Dialog component
export {
  BloraDialog,
  defineBloraDialog,
  BLORA_DIALOG_TAG,
  type BloraDialogOpenDetail,
  type BloraDialogCloseDetail,
} from "./components/dialog/index.js";

// Select component
export {
  BloraSelect,
  defineBloraSelect,
  BLORA_SELECT_TAG,
  type BloraOptionData,
} from "./components/select/index.js";

// Tabs controller
export { createTabsController, type TabsController } from "./components/tabs/index.js";
