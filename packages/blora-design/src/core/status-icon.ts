import { createBloraIcon, type BloraIconName } from "./icons.js";

export type StatusIconVariant = "danger" | "error" | "info" | "success" | "warning";

const STATUS_ICON: Record<StatusIconVariant, BloraIconName> = {
  success: "check",
  danger: "close",
  error: "close",
  warning: "circle-alert",
  info: "info",
};

/** Status glyphs share the Lucide factory so Alert/Result/Message stay on one set. */
export function createStatusIcon(
  doc: Document,
  variant: StatusIconVariant,
  size: number,
): SVGSVGElement {
  return createBloraIcon(STATUS_ICON[variant] ?? "info", size, doc);
}
