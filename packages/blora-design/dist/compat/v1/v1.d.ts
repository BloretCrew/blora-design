/**
 * Blora Design 2.0 - 1.x Compatibility runtime.
 * Spec §23.2-23.3: initV1Compatibility() + deprecation warnings.
 *
 * This module is NOT bundled into the modern entry. It must be explicitly
 * imported by projects that need 1.x markup compatibility:
 *
 *   import { initV1Compatibility } from "@bloret-crew/blora-design/compat/v1";
 *   initV1Compatibility();
 *
 * @packageDocumentation
 */
export { CLASS_MIGRATIONS, STATE_MIGRATIONS, DATA_ATTR_MIGRATIONS, EVENT_MIGRATIONS, } from "./mappings.js";
export interface CompatOptions {
    /** Suppress all deprecation warnings (default: false) */
    silent?: boolean;
    /** Root element to scan (default: document.documentElement) */
    root?: HTMLElement | Document;
    /** Enable MutationObserver for dynamically added nodes (default: true) */
    observe?: boolean;
}
/**
 * Initialize 1.x compatibility layer.
 *
 * Scans the DOM for deprecated 1.x class names and data attributes,
 * applies the corresponding 2.0 equivalents, and emits one-time
 * deprecation warnings (per rule, per page) to the console.
 *
 * @returns A cleanup function that disconnects the MutationObserver
 *          and removes event aliases.
 */
export declare function initV1Compatibility(options?: CompatOptions): () => void;
/**
 * Get a compatibility report without modifying the DOM.
 * Useful for CI checks and debugging.
 */
export interface CompatReport {
    /** Total number of deprecated patterns found */
    total: number;
    /** Individual findings */
    findings: Array<{
        file?: string;
        line?: number;
        ruleId: string;
        element: string;
        suggestion: string;
        docLink: string;
        autoFixable: boolean;
    }>;
}
export declare function getCompatReport(root?: HTMLElement | Document): CompatReport;
//# sourceMappingURL=v1.d.ts.map