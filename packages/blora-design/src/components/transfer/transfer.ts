/**
 * Blora Design 2.0 - Transfer controller
 * Moves checked items between source and target panels.
 */
import { BloraElement } from "../../core/blora-element.js";
import { t } from "../../core/i18n.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_TRANSFER_TAG = "blora-transfer";

export interface TransferController {
  destroy(): void;
}

export function createTransferController(root: HTMLElement): TransferController {
  const panels = root.querySelectorAll<HTMLElement>(".blora-transfer__panel");
  const buttons = root.querySelectorAll<HTMLElement>(".blora-transfer__action, [data-transfer]");
  if (panels.length < 2 || buttons.length === 0) return { destroy: () => {} };

  const sourcePanel = panels[0]!;
  const targetPanel = panels[1]!;
  const sourceList = sourcePanel.querySelector<HTMLElement>(".blora-transfer__list");
  const targetList = targetPanel.querySelector<HTMLElement>(".blora-transfer__list");

  const updateHeads = () => {
    const sourceHead = sourcePanel.querySelector(".blora-transfer__head");
    const targetHead = targetPanel.querySelector(".blora-transfer__head");
    if (sourceHead) {
      const count = sourceList?.querySelectorAll(".blora-transfer__row").length ?? 0;
      sourceHead.textContent = t("transfer.sourceCount", { n: count });
    }
    if (targetHead) {
      const count = targetList?.querySelectorAll(".blora-transfer__row").length ?? 0;
      targetHead.textContent = t("transfer.targetCount", { n: count });
    }
  };

  const move = (direction: string) => {
    if (direction === "right" || direction === "to-right") {
      const checked = Array.from(
        sourceList?.querySelectorAll<HTMLInputElement>(".blora-transfer__row input:checked") ?? [],
      );
      checked.forEach((input) => {
        const row = input.closest(".blora-transfer__row");
        if (row && targetList) {
          input.checked = false;
          targetList.appendChild(row);
        }
      });
    } else {
      const checked = Array.from(
        targetList?.querySelectorAll<HTMLInputElement>(".blora-transfer__row input:checked") ?? [],
      );
      checked.forEach((input) => {
        const row = input.closest(".blora-transfer__row");
        if (row && sourceList) {
          input.checked = false;
          sourceList.appendChild(row);
        }
      });
    }
    updateHeads();
  };

  const onClick = (e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-transfer]");
    if (!btn) return;
    e.preventDefault();
    move(btn.dataset.transfer ?? "right");
  };

  root.addEventListener("click", onClick);

  return {
    destroy() {
      root.removeEventListener("click", onClick);
    },
  };
}

interface TransferItemDefinition {
  checked: boolean;
  disabled: boolean;
  label: string;
  target: boolean;
  value: string;
}

/** Composite CE. Child `<blora-transfer-item>` definitions are converted to official rows. */
export class BloraTransfer extends BloraElement {
  private controller: TransferController | null = null;
  private definitions: TransferItemDefinition[] | null = null;

  static get observedAttributes(): string[] {
    return ["source-label", "target-label", "disabled"];
  }

  attributeChangedCallback(): void {
    if (!this.isConnectedInternal) return;
    this.sync();
  }

  get selectedValues(): string[] {
    const panels = this.querySelectorAll<HTMLElement>(".blora-transfer__panel");
    return Array.from(panels[1]?.querySelectorAll<HTMLInputElement>("input[data-value]") ?? []).map(
      (input) => input.dataset.value ?? input.value,
    );
  }

  protected render(): void {
    if (!this.definitions) {
      this.definitions = Array.from(this.querySelectorAll<HTMLElement>("blora-transfer-item")).map(
        (item) => ({
          checked: item.hasAttribute("checked"),
          disabled: item.hasAttribute("disabled"),
          label: item.getAttribute("label") ?? item.textContent?.trim() ?? "",
          target: item.hasAttribute("target"),
          value: item.getAttribute("value") ?? item.textContent?.trim() ?? "",
        }),
      );
    }

    const source = this.definitions.filter((item) => !item.target);
    const target = this.definitions.filter((item) => item.target);
    const root = document.createElement("div");
    root.className = "blora-transfer";
    root.dataset.bloraGenerated = "";

    const createPanel = (label: string, items: TransferItemDefinition[]) => {
      const panel = document.createElement("div");
      panel.className = "blora-transfer__panel";
      const head = document.createElement("div");
      head.className = "blora-transfer__head";
      head.textContent = `${label} · ${items.length}`;
      const list = document.createElement("div");
      list.className = "blora-transfer__list";

      for (const item of items) {
        const row = document.createElement("label");
        row.className = "blora-transfer__row";
        const input = document.createElement("input");
        input.type = "checkbox";
        input.value = item.value;
        input.dataset.value = item.value;
        input.checked = item.checked;
        input.disabled = item.disabled || this.hasAttribute("disabled");
        const check = document.createElement("span");
        check.className = "blora-transfer__check";
        const text = document.createElement("span");
        text.textContent = item.label;
        row.append(input, check, text);
        list.appendChild(row);
      }

      panel.append(head, list);
      return panel;
    };

    const actions = document.createElement("div");
    actions.className = "blora-transfer__actions";
    const right = document.createElement("button");
    right.className = "blora-button";
    right.dataset.variant = "outline";
    right.dataset.size = "icon";
    right.dataset.transfer = "right";
    right.type = "button";
    right.disabled = this.hasAttribute("disabled");
    right.setAttribute("aria-label", t("transfer.moveRight"));
    right.appendChild(createBloraIcon("chevron-right", 18, this.ownerDocument));
    const left = document.createElement("button");
    left.className = "blora-button";
    left.dataset.variant = "outline";
    left.dataset.size = "icon";
    left.dataset.transfer = "left";
    left.type = "button";
    left.disabled = this.hasAttribute("disabled");
    left.setAttribute("aria-label", t("transfer.moveLeft"));
    left.appendChild(createBloraIcon("chevron-left", 18, this.ownerDocument));
    actions.append(right, left);

    root.append(
      createPanel(this.getAttribute("source-label") ?? t("transfer.source"), source),
      actions,
      createPanel(this.getAttribute("target-label") ?? t("transfer.target"), target),
    );
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const field = this.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea");
    if (field) {
      field.disabled = this.hasAttribute("disabled");
      if (this.hasAttribute("placeholder"))
        field.placeholder = this.getAttribute("placeholder") ?? "";
      if (this.hasAttribute("value") && this.ownerDocument.activeElement !== field) {
        field.value = this.getAttribute("value") ?? field.value;
      }
    }
    this.rebind();
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-transfer");
    if (root) this.controller = createTransferController(root);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraTransfer(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_TRANSFER_TAG)) return;
  registry.define(BLORA_TRANSFER_TAG, BloraTransfer);
}
