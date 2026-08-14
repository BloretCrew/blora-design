/**
 * Lucide-style SVG factory for every UI/status/navigation icon.
 * Add a name here when a component needs a new glyph. Do not hand-draw
 * SVGs, emoji, or text glyphs in components. Brand marks (navbar logo)
 * and non-icon drawings (progress rings) are the only exceptions.
 */
export type BloraIconName = "arrow-up" | "calendar" | "camera" | "chart" | "check" | "chevron-down" | "chevron-left" | "chevron-right" | "circle-alert" | "clock" | "close" | "copy" | "document" | "document-add" | "ellipsis" | "eye" | "folder" | "home" | "image" | "inbox" | "info" | "mail" | "message" | "mic" | "minus" | "moon" | "pencil" | "phone" | "plus" | "search" | "settings" | "share" | "smile" | "star" | "sun" | "trash" | "upload" | "user";
/** Create a decorative, currentColor icon without parsing HTML strings. */
export declare function createBloraIcon(name: BloraIconName, size?: number, doc?: Document): SVGSVGElement;
export declare function isBloraIconName(name: string): name is BloraIconName;
//# sourceMappingURL=icons.d.ts.map