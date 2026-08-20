/**
 * Runtime icon registry for the opt-in full Lucide table.
 *
 * Kept free of the curated `icons.data.ts` import so the `icons-full` module
 * does not drag the curated set into its bundle.
 */
import type { BloraIconNode } from "./icons.data.js";

let extraIconData: Record<string, BloraIconNode[]> | null = null;

/** Merge additional icon data (e.g. the full Lucide table) into the factory. */
export function registerBloraIcons(data: Record<string, BloraIconNode[]>): void {
  extraIconData = { ...(extraIconData ?? {}), ...data };
}

export function lookupExtraIcon(name: string): BloraIconNode[] | undefined {
  return extraIconData?.[name];
}

export function hasExtraIcon(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(extraIconData ?? {}, name);
}
