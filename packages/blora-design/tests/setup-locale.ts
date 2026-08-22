import { applyDocumentLocale } from "../src/core/i18n.js";

if (typeof document !== "undefined") {
  document.documentElement.lang = "zh-CN";
  applyDocumentLocale();
}
