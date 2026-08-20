/**
 * Opt-in full Lucide icon table (global / classic-script entry).
 *
 * Load after `blora.global.js`; registers every Lucide icon into the shared
 * `Blora.createBloraIcon` factory (same module instance), so any name works
 * without a framework rebuild.
 *
 * ```html
 * <script src=".../blora.global.js"></script>
 * <script src=".../icons-full.global.js"></script>
 * ```
 */
import { BLORA_ICON_FULL_DATA } from "../core/icons-full.data.js";
import type { BloraIconNode } from "../core/icons-full.data.js";

const g = globalThis as typeof globalThis & {
  Blora?: { registerBloraIcons?(data: Record<string, BloraIconNode[]>): void };
};

g.Blora?.registerBloraIcons?.(BLORA_ICON_FULL_DATA);
