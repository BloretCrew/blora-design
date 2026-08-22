/**
 * Locale catalog for chrome strings. Components call `t(key)` — they never
 * embed a language. Packs live in `src/locales/`.
 */
import { en } from "../locales/en.js";
import { zhCN } from "../locales/zh-CN.js";

export type BloraMessages = Record<string, string>;

export interface BloraLocalePack {
  collator: string;
  months: string[];
  dow: string[];
  messages: BloraMessages;
}

const packs = new Map<string, BloraLocalePack>([
  ["en", en],
  ["zh-CN", zhCN],
]);

let currentTag = "en";
let documentBound = false;
let explicit = false;

function normalizeTag(tag: string): string {
  const trimmed = tag.trim();
  if (!trimmed) return "en";
  if (/^zh\b/i.test(trimmed)) return "zh-CN";
  if (packs.has(trimmed)) return trimmed;
  const short = trimmed.split("-")[0] ?? "en";
  if (packs.has(short)) return short;
  return "en";
}

export function registerLocale(tag: string, pack: BloraLocalePack): void {
  packs.set(tag, pack);
}

export function setLocale(tag: string, pack?: BloraLocalePack): void {
  if (pack) registerLocale(tag, pack);
  explicit = true;
  currentTag = normalizeTag(tag);
  if (typeof document !== "undefined") {
    document.dispatchEvent(new CustomEvent("blora-locale-change", { bubbles: true }));
  }
}

export function getLocale(): string {
  bindDocumentLocale();
  return currentTag;
}

export function applyDocumentLocale(
  doc: Document | null = typeof document !== "undefined" ? document : null,
): void {
  if (!doc) return;
  explicit = false;
  currentTag = normalizeTag(doc.documentElement.lang || "");
}

function bindDocumentLocale(): void {
  if (documentBound || typeof document === "undefined") return;
  documentBound = true;
  if (!explicit) applyDocumentLocale(document);
}

export function t(key: string, vars?: Record<string, string | number>): string {
  bindDocumentLocale();
  const pack = packs.get(currentTag) ?? packs.get("en");
  let text = pack?.messages[key] ?? packs.get("en")?.messages[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}

export function localeMonths(): string[] {
  bindDocumentLocale();
  return (packs.get(currentTag) ?? en).months;
}

export function localeDow(): string[] {
  bindDocumentLocale();
  return (packs.get(currentTag) ?? en).dow;
}

export function localeCollator(): string {
  bindDocumentLocale();
  return (packs.get(currentTag) ?? en).collator;
}
