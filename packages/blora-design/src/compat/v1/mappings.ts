/**
 * Blora Design 2.0 - 1.x Compatibility class/data attribute mappings.
 *
 * Shared between compat/v1.ts (runtime) and codemod.mjs (build-time).
 * Spec §19.6, §23.2-23.3.
 */

export interface ClassMigration {
  /** v1 class name (without leading dot), e.g. "blora-btn" */
  v1Class: string;
  /** v2 class name to add (without leading dot), or null to keep same class */
  v2Class: string | null;
  /** v2 data attribute to set, e.g. { name: "data-variant", value: "primary" } */
  v2Attr: { name: string; value: string } | null;
  /** Whether to remove the v1 class after migration */
  removeV1: boolean;
  /** Migration doc anchor for warning message */
  docAnchor: string;
}

/**
 * Full class migration table.
 * Order matters: more specific patterns (modifiers) must come before base.
 */
export const CLASS_MIGRATIONS: ClassMigration[] = [
  // -- Button modifiers (must come before base) --
  {
    v1Class: "blora-btn--primary",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "primary" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--secondary",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "secondary" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--danger",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "danger" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--ghost",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "ghost" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--outline",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "outline" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--text",
    v2Class: "blora-button",
    v2Attr: { name: "data-variant", value: "text" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--xs",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "xs" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--sm",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "sm" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--lg",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "lg" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--xl",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "xl" },
    removeV1: true,
    docAnchor: "button",
  },
  {
    v1Class: "blora-btn--icon",
    v2Class: "blora-button",
    v2Attr: { name: "data-size", value: "icon" },
    removeV1: true,
    docAnchor: "button",
  },
  // Button base
  {
    v1Class: "blora-btn",
    v2Class: "blora-button",
    v2Attr: null,
    removeV1: true,
    docAnchor: "button",
  },

  // -- Card modifiers --
  {
    v1Class: "blora-card--hover",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "hover" },
    removeV1: true,
    docAnchor: "card",
  },
  {
    v1Class: "blora-card--flat",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "flat" },
    removeV1: true,
    docAnchor: "card",
  },
  {
    v1Class: "blora-card--inset",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "inset" },
    removeV1: true,
    docAnchor: "card",
  },
  {
    v1Class: "blora-card--relative",
    v2Class: null,
    v2Attr: { name: "data-positioned", value: "" },
    removeV1: true,
    docAnchor: "card",
  },
  {
    v1Class: "blora-card--with-badge",
    v2Class: null,
    v2Attr: { name: "data-with-badge", value: "" },
    removeV1: true,
    docAnchor: "card",
  },

  // -- Table modifiers --
  {
    v1Class: "blora-table--striped",
    v2Class: null,
    v2Attr: { name: "data-striped", value: "" },
    removeV1: true,
    docAnchor: "table",
  },

  // -- List modifiers --
  {
    v1Class: "blora-list--hover",
    v2Class: null,
    v2Attr: { name: "data-hover", value: "" },
    removeV1: true,
    docAnchor: "list",
  },

  // -- Collapse -> Accordion (class rename) --
  {
    v1Class: "blora-collapse__content",
    v2Class: "blora-accordion__content",
    v2Attr: null,
    removeV1: true,
    docAnchor: "accordion",
  },
  {
    v1Class: "blora-collapse__body",
    v2Class: "blora-accordion__body",
    v2Attr: null,
    removeV1: true,
    docAnchor: "accordion",
  },
  {
    v1Class: "blora-collapse__icon",
    v2Class: "blora-accordion__icon",
    v2Attr: null,
    removeV1: true,
    docAnchor: "accordion",
  },
  {
    v1Class: "blora-collapse__head",
    v2Class: "blora-accordion__head",
    v2Attr: null,
    removeV1: true,
    docAnchor: "accordion",
  },
  {
    v1Class: "blora-collapse__item",
    v2Class: "blora-accordion__item",
    v2Attr: null,
    removeV1: true,
    docAnchor: "accordion",
  },
  {
    v1Class: "blora-collapse",
    v2Class: "blora-accordion",
    v2Attr: null,
    removeV1: true,
    docAnchor: "accordion",
  },

  // -- Avatar modifiers --
  {
    v1Class: "blora-avatar--xs",
    v2Class: null,
    v2Attr: { name: "data-size", value: "xs" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--sm",
    v2Class: null,
    v2Attr: { name: "data-size", value: "sm" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--lg",
    v2Class: null,
    v2Attr: { name: "data-size", value: "lg" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--xl",
    v2Class: null,
    v2Attr: { name: "data-size", value: "xl" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--primary",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "primary" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--neutral",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "neutral" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--info",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "info" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--success",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "success" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--contrast",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "contrast" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-avatar--square",
    v2Class: null,
    v2Attr: { name: "data-shape", value: "square" },
    removeV1: true,
    docAnchor: "avatar",
  },

  // -- Timeline dot modifiers --
  {
    v1Class: "blora-timeline__dot--primary",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "primary" },
    removeV1: true,
    docAnchor: "timeline",
  },
  {
    v1Class: "blora-timeline__dot--success",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "success" },
    removeV1: true,
    docAnchor: "timeline",
  },

  // -- Result modifiers --
  {
    v1Class: "blora-result--success",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "success" },
    removeV1: true,
    docAnchor: "result",
  },
  {
    v1Class: "blora-result--warning",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "warning" },
    removeV1: true,
    docAnchor: "result",
  },
  {
    v1Class: "blora-result--error",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "error" },
    removeV1: true,
    docAnchor: "result",
  },
  {
    v1Class: "blora-result--info",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "info" },
    removeV1: true,
    docAnchor: "result",
  },

  // -- Status dot modifiers --
  {
    v1Class: "blora-dot--primary",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "primary" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-dot--success",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "success" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-dot--warning",
    v2Class: null,
    v2Attr: { name: "data-variant", value: "warning" },
    removeV1: true,
    docAnchor: "avatar",
  },
  {
    v1Class: "blora-dot--pulse",
    v2Class: null,
    v2Attr: { name: "data-pulse", value: "" },
    removeV1: true,
    docAnchor: "avatar",
  },
];

/**
 * State class migrations: v1 `.is-*` state classes -> v2 data attributes.
 */
export interface StateMigration {
  /** Parent context class (without dot), e.g. "blora-btn" */
  contextClass: string;
  /** v1 state class (without dot), e.g. "is-loading" */
  v1State: string;
  /** v2 data attribute to set */
  v2Attr: { name: string; value: string };
  /** Migration doc anchor */
  docAnchor: string;
}

export const STATE_MIGRATIONS: StateMigration[] = [
  {
    contextClass: "blora-btn",
    v1State: "is-loading",
    v2Attr: { name: "data-loading", value: "" },
    docAnchor: "button",
  },
  {
    contextClass: "blora-fab",
    v1State: "is-hidden",
    v2Attr: { name: "data-hidden", value: "" },
    docAnchor: "button",
  },
  {
    contextClass: "blora-collapse__item",
    v1State: "is-open",
    v2Attr: { name: "data-open", value: "" },
    docAnchor: "accordion",
  },
  {
    contextClass: "blora-table-wrap",
    v1State: "is-loading",
    v2Attr: { name: "data-loading", value: "" },
    docAnchor: "table",
  },
  {
    contextClass: "blora-table-wrap",
    v1State: "is-empty",
    v2Attr: { name: "data-empty", value: "" },
    docAnchor: "table",
  },
];

/**
 * Data attribute migrations: v1 `data-blora-*` -> v2 equivalents.
 */
export interface DataAttrMigration {
  v1Attr: string;
  v2Attr: string;
  docAnchor: string;
}

export const DATA_ATTR_MIGRATIONS: DataAttrMigration[] = [
  { v1Attr: "data-blora-palette", v2Attr: "data-blora-theme", docAnchor: "tokens" },
  { v1Attr: "data-blora-size", v2Attr: "data-blora-density", docAnchor: "tokens" },
  { v1Attr: "data-blora-color-mode", v2Attr: "data-blora-color-scheme", docAnchor: "tokens" },
];

/**
 * Event name migrations: v1 `blora:*` events -> v2 `blora-*` events.
 */
export interface EventMigration {
  v1Event: string;
  v2Event: string;
  docAnchor: string;
}

export const EVENT_MIGRATIONS: EventMigration[] = [
  { v1Event: "blora:appearancechange", v2Event: "blora-appearance-change", docAnchor: "events" },
  { v1Event: "blora:palettechange", v2Event: "blora-theme-change", docAnchor: "events" },
  { v1Event: "blora:modetoggle", v2Event: "blora-color-scheme-change", docAnchor: "events" },
];
