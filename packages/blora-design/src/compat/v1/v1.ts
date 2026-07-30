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

import {
  CLASS_MIGRATIONS,
  STATE_MIGRATIONS,
  DATA_ATTR_MIGRATIONS,
  EVENT_MIGRATIONS,
} from "./mappings.js";

export {
  CLASS_MIGRATIONS,
  STATE_MIGRATIONS,
  DATA_ATTR_MIGRATIONS,
  EVENT_MIGRATIONS,
} from "./mappings.js";

export interface CompatOptions {
  /** Suppress all deprecation warnings (default: false) */
  silent?: boolean;
  /** Root element to scan (default: document.documentElement) */
  root?: HTMLElement | Document;
  /** Enable MutationObserver for dynamically added nodes (default: true) */
  observe?: boolean;
}

const MIGRATION_DOC_BASE = "/docs/migration/v1-to-v2";

/** Set of already-warned rule IDs to ensure one warning per rule per page. */
const warnedRules = new Set<string>();

function warn(ruleId: string, message: string, docAnchor: string): void {
  if (warnedRules.has(ruleId)) return;
  warnedRules.add(ruleId);

  const link = `${MIGRATION_DOC_BASE}#${docAnchor}`;
  console.warn(`[Blora compat] ${message}\n  See: ${link}`);
}

/**
 * Apply class migrations to a single element.
 * Returns the number of migrations applied.
 */
function migrateElement(el: Element, silent: boolean): number {
  let count = 0;

  // Class migrations
  for (const migration of CLASS_MIGRATIONS) {
    if (!el.classList.contains(migration.v1Class)) continue;

    const ruleId = `class:${migration.v1Class}`;
    if (!silent) {
      const target = migration.v2Class ?? migration.v1Class;
      const attrPart = migration.v2Attr
        ? `[${migration.v2Attr.name}${migration.v2Attr.value ? `="${migration.v2Attr.value}"` : ""}]`
        : "";
      warn(
        ruleId,
        `.${migration.v1Class} is deprecated. Use .${target}${attrPart}.`,
        migration.docAnchor,
      );
    }

    if (migration.v2Class && migration.v2Class !== migration.v1Class) {
      el.classList.add(migration.v2Class);
    }
    if (migration.v2Attr) {
      if (migration.v2Attr.value) {
        el.setAttribute(migration.v2Attr.name, migration.v2Attr.value);
      } else {
        el.setAttribute(migration.v2Attr.name, "");
      }
    }
    if (migration.removeV1) {
      el.classList.remove(migration.v1Class);
    }
    count++;
  }

  // State migrations (.is-* -> data-* attributes)
  for (const state of STATE_MIGRATIONS) {
    if (!el.classList.contains(state.v1State)) continue;
    // Only apply if element has or had the context class
    const hasContext =
      el.classList.contains(state.contextClass) ||
      CLASS_MIGRATIONS.some(
        (m) => m.v1Class === state.contextClass && m.v2Class && el.classList.contains(m.v2Class),
      );
    if (!hasContext) continue;

    const ruleId = `state:${state.contextClass}.${state.v1State}`;
    if (!silent) {
      warn(
        ruleId,
        `.${state.v1State} on .${state.contextClass} is deprecated. Use ${state.v2Attr.name}="${state.v2Attr.value}".`,
        state.docAnchor,
      );
    }

    el.setAttribute(state.v2Attr.name, state.v2Attr.value);
    el.classList.remove(state.v1State);
    count++;
  }

  // Data attribute migrations
  for (const dataMig of DATA_ATTR_MIGRATIONS) {
    if (!el.hasAttribute(dataMig.v1Attr)) continue;

    const ruleId = `attr:${dataMig.v1Attr}`;
    if (!silent) {
      warn(ruleId, `${dataMig.v1Attr} is deprecated. Use ${dataMig.v2Attr}.`, dataMig.docAnchor);
    }

    const value = el.getAttribute(dataMig.v1Attr);
    el.setAttribute(dataMig.v2Attr, value ?? "");
    el.removeAttribute(dataMig.v1Attr);
    count++;
  }

  return count;
}

/**
 * Scan all descendants of `root` and apply migrations.
 */
function scanRoot(root: ParentNode, silent: boolean): number {
  let total = 0;
  const elements = root.querySelectorAll("*");
  for (const el of elements) {
    total += migrateElement(el, silent);
  }
  // Also check root itself if it's an element
  if (root instanceof Element) {
    total += migrateElement(root, silent);
  }
  return total;
}

/**
 * Set up event name aliases.
 * v1 events like `blora:appearancechange` are re-dispatched as v2 events.
 */
function setupEventAliases(root: HTMLElement | Document): void {
  for (const eventMig of EVENT_MIGRATIONS) {
    root.addEventListener(
      eventMig.v1Event,
      (e: Event) => {
        const alias = new CustomEvent(eventMig.v2Event, {
          bubbles: e.bubbles,
          cancelable: e.cancelable,
          detail: (e as CustomEvent).detail,
        });
        e.target?.dispatchEvent(alias);
      },
      { signal: lifecycleController.signal },
    );
  }
}

// AbortController for managing event listener cleanup
let lifecycleController: AbortController;

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
export function initV1Compatibility(options: CompatOptions = {}): () => void {
  const { silent = false, observe = true } = options;

  // SSR guard
  if (typeof document === "undefined") {
    return () => {};
  }

  const root = options.root ?? document.documentElement;
  lifecycleController = new AbortController();

  // Initial scan
  const migrated = scanRoot(root, silent);

  if (!silent && migrated > 0) {
    console.warn(
      `[Blora compat] Applied ${migrated} migration(s). Run the codemod to fix these automatically: npx @bloret-crew/blora-codemod .`,
    );
  }

  // Set up event aliases
  setupEventAliases(root);

  // Watch for dynamically added nodes
  let observer: MutationObserver | null = null;
  if (observe && typeof MutationObserver !== "undefined") {
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            migrateElement(node as Element, silent);
            scanRoot(node as ParentNode, silent);
          }
        }
      }
    });
    observer.observe(root, { childList: true, subtree: true });
  }

  // Return cleanup function
  return () => {
    lifecycleController?.abort();
    observer?.disconnect();
  };
}

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

export function getCompatReport(root?: HTMLElement | Document): CompatReport {
  const target = root ?? (typeof document !== "undefined" ? document.documentElement : null);
  if (!target) {
    return { total: 0, findings: [] };
  }

  const findings: CompatReport["findings"] = [];

  const elements = target.querySelectorAll("*");
  for (const el of elements) {
    for (const migration of CLASS_MIGRATIONS) {
      if (!el.classList.contains(migration.v1Class)) continue;
      const targetClass = migration.v2Class ?? migration.v1Class;
      const attrPart = migration.v2Attr
        ? `[${migration.v2Attr.name}${migration.v2Attr.value ? `="${migration.v2Attr.value}"` : ""}]`
        : "";
      findings.push({
        ruleId: `class:${migration.v1Class}`,
        element: el.tagName.toLowerCase() + ` .${migration.v1Class}`,
        suggestion: `.${targetClass}${attrPart}`,
        docLink: `${MIGRATION_DOC_BASE}#${migration.docAnchor}`,
        autoFixable: true,
      });
    }

    for (const dataMig of DATA_ATTR_MIGRATIONS) {
      if (!el.hasAttribute(dataMig.v1Attr)) continue;
      findings.push({
        ruleId: `attr:${dataMig.v1Attr}`,
        element: el.tagName.toLowerCase() + ` [${dataMig.v1Attr}]`,
        suggestion: `[${dataMig.v2Attr}]`,
        docLink: `${MIGRATION_DOC_BASE}#${dataMig.docAnchor}`,
        autoFixable: true,
      });
    }
  }

  return { total: findings.length, findings };
}
