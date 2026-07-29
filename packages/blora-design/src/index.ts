/**
 * Blora Design 2.0 - Package entry point
 *
 * This is the modern ESM entry. Importing from here will tree-shake
 * to only the components you actually use.
 *
 * @packageDocumentation
 */

export const VERSION = "2.0.0-alpha.0";

/**
 * SSR-safe check for whether we are in a browser environment.
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
