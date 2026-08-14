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
    v2Attr: {
        name: string;
        value: string;
    } | null;
    /** Whether to remove the v1 class after migration */
    removeV1: boolean;
    /** Migration doc anchor for warning message */
    docAnchor: string;
}
/**
 * Full class migration table.
 * Order matters: more specific patterns (modifiers) must come before base.
 */
export declare const CLASS_MIGRATIONS: ClassMigration[];
/**
 * State class migrations: v1 `.is-*` state classes -> v2 data attributes.
 */
export interface StateMigration {
    /** Parent context class (without dot), e.g. "blora-btn" */
    contextClass: string;
    /** v1 state class (without dot), e.g. "is-loading" */
    v1State: string;
    /** v2 data attribute to set */
    v2Attr: {
        name: string;
        value: string;
    };
    /** Migration doc anchor */
    docAnchor: string;
}
export declare const STATE_MIGRATIONS: StateMigration[];
/**
 * Data attribute migrations: v1 `data-blora-*` -> v2 equivalents.
 */
export interface DataAttrMigration {
    v1Attr: string;
    v2Attr: string;
    docAnchor: string;
}
export declare const DATA_ATTR_MIGRATIONS: DataAttrMigration[];
/**
 * Event name migrations: v1 `blora:*` events -> v2 `blora-*` events.
 */
export interface EventMigration {
    v1Event: string;
    v2Event: string;
    docAnchor: string;
}
export declare const EVENT_MIGRATIONS: EventMigration[];
//# sourceMappingURL=mappings.d.ts.map