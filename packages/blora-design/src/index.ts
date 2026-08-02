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
  type DatepickerController,
} from "./components/datepicker/index.js";
export {
  createTimepickerController,
  type TimepickerController,
} from "./components/timepicker/index.js";
export { createSplitterController, type SplitterController } from "./components/splitter/index.js";
export { createTourController, type TourController } from "./components/tour/index.js";
export { createDockController, type DockController } from "./components/dock/index.js";
export {
  createMegamenuController,
  type MegamenuController,
} from "./components/megamenu/index.js";
export {
  createSpeedDialController,
  type SpeedDialController,
} from "./components/speed-dial/index.js";
export { createSearchController, type SearchController } from "./components/search/index.js";
export {
  createColorPickerController,
  type ColorPickerController,
} from "./components/color-picker/index.js";
export { createCopyController, type CopyController } from "./components/copy/index.js";
export {
  createTransferController,
  type TransferController,
} from "./components/transfer/index.js";
export { createFieldController, type FieldController } from "./components/field/index.js";
/* TextRotate → @bloret-crew/blora-design-effects */
export { createCalendarController, type CalendarController } from "./components/calendar/index.js";
export { createDeckController, type DeckController } from "./components/deck/index.js";
export {
  createTagsInputController,
  type TagsInputController,
} from "./components/tags-input/index.js";
export { createUploadController, type UploadController } from "./components/upload/index.js";
export {
  createCommandPaletteController,
  type CommandPaletteController,
} from "./components/command-palette/index.js";

// Overlays / data / feedback controllers (batch fill)
export { createCollapseController, type CollapseController } from "./components/collapse/index.js";
export {
  createDrawerController,
  bindDrawerTriggers,
  type DrawerController,
} from "./components/drawer/index.js";
export { createTooltipController, type TooltipController } from "./components/tooltip/index.js";
export { createPopoverController, type PopoverController } from "./components/popover/index.js";
export {
  createSegmentedController,
  type SegmentedController,
} from "./components/segmented/index.js";
export {
  createPaginationController,
  type PaginationController,
} from "./components/pagination/index.js";
export {
  createCheckboxController,
  type CheckboxController,
} from "./components/checkbox/index.js";
export { toast, message, type ToastOptions, type ToastHandle } from "./components/toast/index.js";
export {
  createTableController,
  type TableController,
  type TableControllerOptions,
  type TableColConfig,
  type TableRowData,
} from "./components/table/index.js";
export {
  createPopconfirmController,
  type PopconfirmController,
} from "./components/popconfirm/index.js";
export {
  createProgressController,
  type ProgressController,
} from "./components/progress/index.js";
export {
  createAccordionController,
  type AccordionController,
} from "./components/accordion/index.js";
export {
  createImageController,
  openImagePreview,
  type ImageController,
  type ImagePreviewHandle,
  type ImagePreviewItem,
} from "./components/image/index.js";
export {
  createTreeSelectController,
  type TreeSelectController,
  type TreeSelectOption,
} from "./components/tree-select/index.js";
export {
  createFormController,
  getFormValues,
  type FormController,
  type FormValidateResult,
} from "./components/form/index.js";
export {
  createBackTopController,
  initBackTop,
  BACKTOP_ARROW_SVG,
  type BackTopController,
  type BackTopOptions,
} from "./components/backtop/index.js";
export {
  notify,
  createNotificationController,
  type NotificationOptions,
  type NotificationHandle,
  type NotificationPlacement,
} from "./components/notification/index.js";
export { createStepsController, type StepsController } from "./components/steps/index.js";
