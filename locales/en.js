/**
 * Blora Design · en locale pack
 * Usage:
 *   const en = require("@bloret/blora-design/locales/en");
 *   Blora.setLocale("en", en);
 */
(function (root, factory) {
  const pack = factory();
  if (typeof module === "object" && module.exports) module.exports = pack;
  if (root) {
    root.BloraLocales = root.BloraLocales || {};
    root.BloraLocales.en = pack;
  }
}(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  return {
    collator: "en",
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    dow: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    year: "",
    today: "Today",
    clear: "Clear",
    now: "Now",
    confirm: "OK",
    hour: "Hour",
    minute: "Min",
    messages: {
      "validate.required": "This field is required",
      "validate.email": "Please enter a valid email",
      "validate.url": "Please enter a valid URL",
      "validate.number": "Please enter a valid number",
      "validate.min": "Must be ≥ {n}",
      "validate.max": "Must be ≤ {n}",
      "validate.minlength": "At least {n} characters",
      "validate.maxlength": "At most {n} characters",
      "validate.pattern": "Invalid format",
      "validate.mismatch": "Values do not match",
      "validate.async": "Validation failed",
      "pagination.prev": "Previous page",
      "pagination.next": "Next page",
      "pagination.page": "Page {n}",
      "pagination.nav": "Pagination",
      "cascader.selectedPrefix": "Selected: ",
      "common.close": "Close",
      "common.cancel": "Cancel",
      "common.ok": "OK",
      "common.next": "Next",
      "common.prev": "Back",
      "common.skip": "Skip",
      "common.done": "Done",
      "common.copy": "Copy",
      "common.copied": "Copied",
      "common.backTop": "Back to top",
      "common.min": "Minimum",
      "common.max": "Maximum",
      "table.empty": "No data",
      "table.loading": "Loading…",
      "table.selectAll": "Select all",
      "table.selectRow": "Select row",
      "table.selected": "{n} selected",
      "table.clearSelection": "Clear selection",
      "table.bulk": "Bulk actions",
      "table.cols": "Columns",
      "table.colsReset": "Reset columns",
      "table.colDrag": "Drag to reorder",
      "select.search": "Search…",
      "select.empty": "No matches",
      "select.placeholder": "Select",
      "select.more": "+{n}",
      "palette.title": "Palette",
      "palette.hint": "Semantic colors only — component shapes stay the same",
      "palette.label": "Palette",
      "colorMode.system": "System",
      "colorMode.light": "Light",
      "colorMode.dark": "Dark",
      "colorMode.switch": "Now {current}, switch to {next}",
      "upload.remove": "Remove",
      "upload.drop": "Drop files here",
      "upload.or": "or",
      "upload.browse": "browse",
      "file.clear": "Remove selected file",
      "preview.prev": "Previous image",
      "preview.next": "Next image",
      "preview.close": "Close preview",
      "tour.step": "{current} / {total}",
      "autocomplete.empty": "No matches",
      "color.swatch": "Pick color, current {color}",
      "color.panel": "Color picker",
      "color.hue": "Hue",
      "color.spectrum": "Saturation and brightness",
      "color.hex": "Hex color",
    },
  };
}));
