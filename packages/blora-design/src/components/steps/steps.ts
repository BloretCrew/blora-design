/**
 * Steps: click/keyboard to set current step (optional interactive path).
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_STEPS_TAG = "blora-steps";

export interface StepsController {
  setCurrent(index: number): void;
  getCurrent(): number;
  destroy(): void;
}

export function createStepsController(root: HTMLElement): StepsController {
  if (typeof document === "undefined") {
    return { setCurrent: () => {}, getCurrent: () => 0, destroy: () => {} };
  }
  root.classList.add("blora-steps");
  const steps = () =>
    Array.from(root.querySelectorAll<HTMLElement>(".blora-step, [data-blora-step]"));

  const getCurrent = () => {
    const list = steps();
    const i = list.findIndex(
      (s) =>
        s.hasAttribute("data-current") ||
        s.getAttribute("data-state") === "active" ||
        s.getAttribute("data-status") === "process",
    );
    return i >= 0 ? i : 0;
  };

  const setCurrent = (index: number) => {
    const list = steps();
    list.forEach((s, i) => {
      s.removeAttribute("data-current");
      s.removeAttribute("data-status");
      if (i < index) s.setAttribute("data-state", "done");
      else if (i === index) {
        s.setAttribute("data-state", "active");
        s.setAttribute("data-current", "");
      } else s.setAttribute("data-state", "pending");
      if (i === index) s.setAttribute("aria-current", "step");
      else s.removeAttribute("aria-current");
    });
    root.dispatchEvent(new CustomEvent("blora-steps-change", { bubbles: true, detail: { index } }));
  };

  const onClick = (e: MouseEvent) => {
    if (root.getAttribute("data-clickable") === "false") return;
    const step = (e.target as HTMLElement).closest<HTMLElement>(".blora-step, [data-blora-step]");
    if (!step || !root.contains(step)) return;
    const list = steps();
    const i = list.indexOf(step);
    if (i >= 0) setCurrent(i);
  };

  root.addEventListener("click", onClick);
  /* normalize initial */
  setCurrent(getCurrent());

  return {
    setCurrent,
    getCurrent,
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}

interface StepDefinition {
  description: string;
  icon: string;
  state: "pending" | "active" | "done" | null;
  title: string;
}

/** Composite CE. Child `<blora-step>` definitions become the official Steps tree. */
export class BloraSteps extends BloraElement {
  private controller: StepsController | null = null;
  private definitions: StepDefinition[] | null = null;

  static get observedAttributes(): string[] {
    return ["current", "clickable"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  get current(): number {
    return this.controller?.getCurrent() ?? Number(this.getAttribute("current") ?? 0);
  }

  set current(index: number) {
    this.setAttribute("current", String(index));
  }

  setCurrent(index: number): void {
    this.current = index;
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.children)
        .filter((item) => item.localName === "blora-step")
        .map((item) => {
          const rawState = item.getAttribute("state");
          const state =
            rawState === "pending" || rawState === "active" || rawState === "done"
              ? rawState
              : null;
          return {
            description: item.getAttribute("description") ?? "",
            icon: item.getAttribute("icon") ?? "",
            state,
            title: item.getAttribute("title") ?? item.textContent?.trim() ?? "",
          };
        });
    }

    const explicitCurrent = this.getAttribute("current");
    const stateCurrent = this.definitions.findIndex((definition) => definition.state === "active");
    const current = explicitCurrent === null ? Math.max(0, stateCurrent) : Number(explicitCurrent);
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-steps";
    root.dataset.bloraGenerated = "";
    root.dataset.clickable = String(this.getAttribute("clickable") !== "false");

    this.definitions.forEach((definition, index) => {
      const step = this.ownerDocument.createElement("div");
      step.className = "blora-step";
      const head = this.ownerDocument.createElement("div");
      head.className = "blora-step__head";
      const icon = this.ownerDocument.createElement("span");
      icon.className = "blora-step__icon";
      if (index < current && !definition.icon) {
        icon.appendChild(createBloraIcon("check", 16, this.ownerDocument));
      } else {
        icon.textContent = definition.icon || String(index + 1);
      }
      const line = this.ownerDocument.createElement("div");
      line.className = "blora-step__line";
      line.setAttribute("aria-hidden", "true");
      head.append(icon, line);
      const title = this.ownerDocument.createElement("div");
      title.className = "blora-step__title";
      title.textContent = definition.title;
      step.append(head, title);
      if (definition.description) {
        const description = this.ownerDocument.createElement("div");
        description.className = "blora-step__desc";
        description.textContent = definition.description;
        step.appendChild(description);
      }
      if (index < current) step.dataset.state = "done";
      else if (index === current) step.dataset.state = "active";
      else step.dataset.state = "pending";
      root.appendChild(step);
    });
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const current = Number(this.getAttribute("current") ?? 0);
    this.controller?.setCurrent(current);
    const root = this.querySelector<HTMLElement>(".blora-steps");
    if (root) root.dataset.clickable = String(this.getAttribute("clickable") !== "false");
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-steps");
    if (!root) return;
    this.controller = createStepsController(root);
    this.listen(root, "blora-steps-change", (event) => {
      const index = (event as CustomEvent<{ index: number }>).detail.index;
      if (this.getAttribute("current") !== String(index))
        this.setAttribute("current", String(index));
    });
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraSteps(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_STEPS_TAG)) return;
  registry.define(BLORA_STEPS_TAG, BloraSteps);
}
