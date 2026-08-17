/**
 * Optional Lucide hydration for native `.blora-badge[data-icon]`.
 * CSS does not depend on this helper — authors may also put an SVG child in.
 */

import { createBloraIcon, isBloraIconName } from "../../core/icons.js";

/**
 * Hydrate `.blora-badge[data-icon]` with `createBloraIcon()`.
 * Safe to call more than once — existing injected icons are left alone.
 */
export function enhanceBadges(root: ParentNode = document): void {
  if (typeof document === "undefined") return;
  root.querySelectorAll<HTMLElement>(".blora-badge[data-icon]").forEach((badge) => {
    const name = badge.getAttribute("data-icon");
    if (!name || !isBloraIconName(name)) return;
    if (badge.querySelector(":scope > svg[data-blora-icon]")) return;
    const icon = createBloraIcon(name, 12, badge.ownerDocument);
    icon.dataset.bloraIcon = name;
    if (badge.getAttribute("data-icon-position") === "end") badge.append(icon);
    else badge.prepend(icon);
  });
}
