/**
 * Side-effect entry: register all stable Custom Elements.
 *
 * ```js
 * import "@bloret-crew/blora-design/auto";
 * ```
 *
 * Controllers and CSS are still imported separately — this only runs
 * `customElements.define` for shipped CE (Select, Dialog).
 *
 * @packageDocumentation
 */

import { defineBloraDialog } from "./components/dialog/index.js";
import { defineBloraSelect } from "./components/select/index.js";

if (typeof customElements !== "undefined") {
  defineBloraDialog();
  defineBloraSelect();
}

export { defineBloraDialog, defineBloraSelect };
