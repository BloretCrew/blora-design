/**
 * Lucide-style SVG factory for every UI/status/navigation icon.
 * Add a name here when a component needs a new glyph. Do not hand-draw
 * SVGs, emoji, or text glyphs in components. Brand marks (navbar logo)
 * and non-icon drawings (progress rings) are the only exceptions.
 */
export type BloraIconName =
  | "arrow-up"
  | "calendar"
  | "camera"
  | "chart"
  | "check"
  | "chevron-down"
  | "chevron-left"
  | "chevron-right"
  | "circle-alert"
  | "clock"
  | "close"
  | "copy"
  | "document"
  | "document-add"
  | "ellipsis"
  | "eye"
  | "folder"
  | "home"
  | "image"
  | "inbox"
  | "info"
  | "mail"
  | "message"
  | "mic"
  | "minus"
  | "moon"
  | "pencil"
  | "phone"
  | "plus"
  | "search"
  | "settings"
  | "share"
  | "smile"
  | "star"
  | "sun"
  | "trash"
  | "upload"
  | "user";

const SVG_NS = "http://www.w3.org/2000/svg";

function svgNode(
  doc: Document,
  tag: "circle" | "path" | "rect",
  attributes: Record<string, string>,
): SVGElement {
  const node = doc.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
  return node;
}

/** Create a decorative, currentColor icon without parsing HTML strings. */
export function createBloraIcon(
  name: BloraIconName,
  size = 16,
  doc: Document = document,
): SVGSVGElement {
  const svg = doc.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", String(size));
  svg.setAttribute("height", String(size));
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("fill", "none");
  svg.setAttribute("stroke", "currentColor");
  svg.setAttribute("stroke-width", "2");
  svg.setAttribute("stroke-linecap", "round");
  svg.setAttribute("stroke-linejoin", "round");
  svg.setAttribute("aria-hidden", "true");

  const nodes: SVGElement[] = [];
  switch (name) {
    case "arrow-up":
      nodes.push(svgNode(doc, "path", { d: "M12 19V5M5 12l7-7 7 7" }));
      break;
    case "calendar":
      nodes.push(
        svgNode(doc, "rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }),
        svgNode(doc, "path", { d: "M16 2v4M8 2v4M3 10h18" }),
      );
      break;
    case "camera":
      nodes.push(
        svgNode(doc, "path", {
          d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z",
        }),
        svgNode(doc, "circle", { cx: "12", cy: "13", r: "4" }),
      );
      break;
    case "chart":
      nodes.push(
        svgNode(doc, "path", { d: "M3 3v18h18" }),
        svgNode(doc, "path", { d: "M7 16v-3M12 16V8M17 16V5" }),
      );
      break;
    case "check":
      nodes.push(svgNode(doc, "path", { d: "M20 6 9 17l-5-5" }));
      break;
    case "chevron-down":
      nodes.push(svgNode(doc, "path", { d: "m6 9 6 6 6-6" }));
      break;
    case "chevron-left":
      nodes.push(svgNode(doc, "path", { d: "m15 18-6-6 6-6" }));
      break;
    case "chevron-right":
      nodes.push(svgNode(doc, "path", { d: "m9 18 6-6-6-6" }));
      break;
    case "circle-alert":
      nodes.push(
        svgNode(doc, "circle", { cx: "12", cy: "12", r: "10" }),
        svgNode(doc, "path", { d: "M12 8v4M12 16h.01" }),
      );
      break;
    case "clock":
      nodes.push(
        svgNode(doc, "circle", { cx: "12", cy: "12", r: "10" }),
        svgNode(doc, "path", { d: "M12 6v6l4 2" }),
      );
      break;
    case "close":
      nodes.push(svgNode(doc, "path", { d: "M18 6 6 18M6 6l12 12" }));
      break;
    case "copy":
      nodes.push(
        svgNode(doc, "rect", { x: "9", y: "9", width: "13", height: "13", rx: "2" }),
        svgNode(doc, "path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }),
      );
      break;
    case "document":
      nodes.push(
        svgNode(doc, "path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
        svgNode(doc, "path", { d: "M14 2v6h6" }),
      );
      break;
    case "document-add":
      nodes.push(
        svgNode(doc, "path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
        svgNode(doc, "path", { d: "M14 2v6h6M12 18v-6M9 15h6" }),
      );
      break;
    case "ellipsis":
      nodes.push(
        svgNode(doc, "circle", { cx: "5", cy: "12", r: "1" }),
        svgNode(doc, "circle", { cx: "12", cy: "12", r: "1" }),
        svgNode(doc, "circle", { cx: "19", cy: "12", r: "1" }),
      );
      break;
    case "eye":
      nodes.push(
        svgNode(doc, "path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }),
        svgNode(doc, "circle", { cx: "12", cy: "12", r: "3" }),
      );
      break;
    case "folder":
      nodes.push(
        svgNode(doc, "path", {
          d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
        }),
      );
      break;
    case "home":
      nodes.push(
        svgNode(doc, "path", { d: "m3 11 9-9 9 9v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
        svgNode(doc, "path", { d: "M9 22V12h6v10" }),
      );
      break;
    case "image":
      nodes.push(
        svgNode(doc, "rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }),
        svgNode(doc, "circle", { cx: "9", cy: "9", r: "2" }),
        svgNode(doc, "path", { d: "m21 15-3.5-3.5a2 2 0 0 0-2.8 0L6 20" }),
      );
      break;
    case "inbox":
      nodes.push(
        svgNode(doc, "path", {
          d: "M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        }),
      );
      break;
    case "info":
      nodes.push(
        svgNode(doc, "circle", { cx: "12", cy: "12", r: "10" }),
        svgNode(doc, "path", { d: "M12 16v-4M12 8h.01" }),
      );
      break;
    case "mail":
      nodes.push(
        svgNode(doc, "rect", { x: "3", y: "5", width: "18", height: "14", rx: "2" }),
        svgNode(doc, "path", { d: "m3 7 9 6 9-6" }),
      );
      break;
    case "message":
      nodes.push(
        svgNode(doc, "path", {
          d: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z",
        }),
      );
      break;
    case "mic":
      nodes.push(
        svgNode(doc, "path", {
          d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8",
        }),
      );
      break;
    case "minus":
      nodes.push(svgNode(doc, "path", { d: "M5 12h14" }));
      break;
    case "moon":
      nodes.push(svgNode(doc, "path", { d: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z" }));
      break;
    case "pencil":
      nodes.push(
        svgNode(doc, "path", { d: "M12 20h9" }),
        svgNode(doc, "path", { d: "M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4z" }),
      );
      break;
    case "phone":
      nodes.push(
        svgNode(doc, "path", {
          d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z",
        }),
      );
      break;
    case "plus":
      nodes.push(svgNode(doc, "path", { d: "M12 5v14M5 12h14" }));
      break;
    case "search":
      nodes.push(
        svgNode(doc, "circle", { cx: "11", cy: "11", r: "7" }),
        svgNode(doc, "path", { d: "m21 21-4.34-4.34" }),
      );
      break;
    case "settings":
      nodes.push(
        svgNode(doc, "path", {
          d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
        }),
        svgNode(doc, "circle", { cx: "12", cy: "12", r: "3" }),
      );
      break;
    case "share":
      nodes.push(
        svgNode(doc, "circle", { cx: "18", cy: "5", r: "3" }),
        svgNode(doc, "circle", { cx: "6", cy: "12", r: "3" }),
        svgNode(doc, "circle", { cx: "18", cy: "19", r: "3" }),
        svgNode(doc, "path", { d: "m8.6 10.5 6.8-4M8.6 13.5l6.8 4" }),
      );
      break;
    case "smile":
      nodes.push(
        svgNode(doc, "circle", { cx: "12", cy: "12", r: "10" }),
        svgNode(doc, "path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }),
        svgNode(doc, "path", { d: "M9 9h.01M15 9h.01" }),
      );
      break;
    case "star":
      nodes.push(
        svgNode(doc, "path", {
          d: "m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1z",
        }),
      );
      break;
    case "sun":
      nodes.push(
        svgNode(doc, "circle", { cx: "12", cy: "12", r: "4" }),
        svgNode(doc, "path", {
          d: "M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41",
        }),
      );
      break;
    case "trash":
      nodes.push(svgNode(doc, "path", { d: "M3 6h18M8 6V4h8v2M19 6l-1 15H6L5 6M10 11v6M14 11v6" }));
      break;
    case "upload":
      nodes.push(
        svgNode(doc, "path", { d: "M12 3v12m5-7-5-5-5 5" }),
        svgNode(doc, "path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
      );
      break;
    case "user":
      nodes.push(
        svgNode(doc, "circle", { cx: "12", cy: "8", r: "5" }),
        svgNode(doc, "path", { d: "M20 21a8 8 0 0 0-16 0" }),
      );
      break;
  }

  svg.append(...nodes);
  return svg;
}

const ICON_NAMES = new Set<string>([
  "arrow-up",
  "calendar",
  "camera",
  "chart",
  "check",
  "chevron-down",
  "chevron-left",
  "chevron-right",
  "circle-alert",
  "clock",
  "close",
  "copy",
  "document",
  "document-add",
  "ellipsis",
  "eye",
  "folder",
  "home",
  "image",
  "inbox",
  "info",
  "mail",
  "message",
  "mic",
  "minus",
  "moon",
  "pencil",
  "phone",
  "plus",
  "search",
  "settings",
  "share",
  "smile",
  "star",
  "sun",
  "trash",
  "upload",
  "user",
]);

export function isBloraIconName(name: string): name is BloraIconName {
  return ICON_NAMES.has(name);
}
