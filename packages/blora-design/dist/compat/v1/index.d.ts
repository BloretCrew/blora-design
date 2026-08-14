/**
 * Blora Design 2.0 - 1.x Compatibility entry point.
 *
 * Spec §23.2: Independent entry, not bundled into modern bundle.
 *
 * Usage:
 *   import { initV1Compatibility } from "@bloret-crew/blora-design/compat/v1";
 *   initV1Compatibility();
 */
export { initV1Compatibility, getCompatReport, type CompatOptions, type CompatReport, } from "./v1.js";
export { CLASS_MIGRATIONS, STATE_MIGRATIONS, DATA_ATTR_MIGRATIONS, EVENT_MIGRATIONS, type ClassMigration, type StateMigration, type DataAttrMigration, type EventMigration, } from "./mappings.js";
//# sourceMappingURL=index.d.ts.map