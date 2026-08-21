/**
 * Blora Design 2.0 - Effects add-on.
 * Spec §9: Add-on package, not bundled into core.
 * Composite CEs own the DOM lifecycles (text-fx, rotate, countdown, countup,
 * diff, hover-gallery, watermark); controllers and shortcut helpers remain
 * imperative services.
 * @packageDocumentation
 */

export {
  createTextRotateController,
  createCountdownController,
  createCountUpController,
  createImageDiffController,
  createHoverGalleryController,
  createWatermarkController,
  initShortcutHints,
  formatShortcut,
  getShortcutPlatform,
  textFx,
  BloraTextFx,
  BloraTextRotate,
  BloraCountdown,
  BloraCountUp,
  BloraDiff,
  BloraHoverGallery,
  BloraWatermark,
  defineBloraEffectsElements,
  BLORA_TEXT_FX_TAG,
  BLORA_TEXT_ROTATE_TAG,
  BLORA_COUNTDOWN_TAG,
  BLORA_COUNT_UP_TAG,
  BLORA_DIFF_TAG,
  BLORA_HOVER_GALLERY_TAG,
  BLORA_WATERMARK_TAG,
  type TextFxName,
  type TextFxOptions,
  type TextRotateController,
  type CountdownController,
  type CountUpController,
  type ImageDiffController,
  type HoverGalleryController,
  type WatermarkController,
} from "./extras.js";
