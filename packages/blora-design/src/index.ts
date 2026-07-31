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

// Dropdown controller
export { createDropdownController, type DropdownController } from "./components/dropdown/index.js";

// Interactive controllers (headless, story/demo wiring)
export { createSliderController, type SliderController } from "./components/slider/index.js";
export { createRangeController, type RangeController } from "./components/range/index.js";
export { createRateController, type RateController } from "./components/rate/index.js";
export { createCarouselController, type CarouselController } from "./components/carousel/index.js";
export { createTreeController, type TreeController } from "./components/tree/index.js";
export {
  createAutocompleteController,
  type AutocompleteController,
} from "./components/autocomplete/index.js";
export { createMentionsController, type MentionsController } from "./components/mentions/index.js";
export { createOtpController, type OtpController } from "./components/otp/index.js";
export { createCascaderController, type CascaderController } from "./components/cascader/index.js";
export {
  createDatepickerController,
  createTimepickerController,
  type DatepickerController,
} from "./components/datepicker/index.js";
export { createSplitterController, type SplitterController } from "./components/splitter/index.js";
export { createTourController, type TourController } from "./components/tour/index.js";
export {
  createDockController,
  type DockController,
  createMegamenuController,
  type MegamenuController,
  createSpeedDialController,
  type SpeedDialController,
} from "./components/dock/index.js";
export { createSearchController, type SearchController } from "./components/search/index.js";
export {
  createColorPickerController,
  type ColorPickerController,
  createTextRotateController,
  type TextRotateController,
  createCopyController,
  type CopyController,
  createTransferController,
  type TransferController,
  createFieldController,
  type FieldController,
} from "./components/copy/index.js";
