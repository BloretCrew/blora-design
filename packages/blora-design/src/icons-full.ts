/**
 * Opt-in full Lucide icon table (ESM entry).
 *
 * Importing this module registers every Lucide icon into `createBloraIcon`,
 * so any name works without a framework rebuild. The curated default set stays
 * in the core bundle; the full ~84 KB (gzip) table is only pulled in when an
 * app opts in.
 *
 * ```ts
 * import "@bloret-crew/blora-design/icons-full";
 * createBloraIcon("rocket"); // works after registration
 * ```
 */
import { BLORA_ICON_FULL_DATA } from "./core/icons-full.data.js";
import { registerBloraIcons } from "./core/icons-registry.js";

registerBloraIcons(BLORA_ICON_FULL_DATA);
