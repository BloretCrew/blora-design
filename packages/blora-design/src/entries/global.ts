/**
 * CDN / classic-script global build entry.
 * Attaches a `Blora` object on `globalThis` with main package exports + CE define helpers.
 */
import * as api from "../index.js";
import { defineBloraDialog, defineBloraSelect } from "../auto.js";

export type BloraGlobal = typeof api & {
  defineBloraSelect: typeof defineBloraSelect;
  defineBloraDialog: typeof defineBloraDialog;
  autoDefine(): void;
};

const Blora: BloraGlobal = {
  ...api,
  defineBloraSelect,
  defineBloraDialog,
  autoDefine() {
    defineBloraSelect();
    defineBloraDialog();
  },
};

const g = globalThis as typeof globalThis & { Blora?: BloraGlobal };
g.Blora = Blora;

export default Blora;
