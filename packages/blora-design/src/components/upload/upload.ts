/**
 * Blora Design 2.0 - Upload controller
 * Click dropzone opens file picker; lists selected file names.
 */
import { BloraElement } from "../../core/blora-element.js";
import { createBloraIcon } from "../../core/icons.js";

export const BLORA_UPLOAD_TAG = "blora-upload";
export interface UploadController {
  destroy(): void;
}

export function createUploadController(root: HTMLElement): UploadController {
  const zone = root.querySelector<HTMLElement>(
    ".blora-dropzone, .blora-file-picker, .blora-upload__zone",
  );
  if (!zone) return { destroy: () => {} };

  const compact = zone.classList.contains("blora-file-picker");
  let input = root.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.className = compact ? "blora-file-picker__input" : "blora-dropzone__input";
    input.setAttribute("aria-hidden", "true");
    root.appendChild(input);
  }

  const list = root.querySelector<HTMLElement>(".blora-upload__list");
  const empty = root.querySelector<HTMLElement>(".blora-file-picker__empty");
  const status = root.querySelector<HTMLElement>(".blora-file-picker__status");
  const statusName = root.querySelector<HTMLElement>(".blora-file-status__name");
  const clear = root.querySelector<HTMLButtonElement>(".blora-file-clear");
  const trigger = root.querySelector<HTMLElement>(".blora-file-picker__trigger");

  const showCompactSelection = (files: FileList | null) => {
    const first = files?.[0];
    if (!empty || !status || !statusName) return;
    if (!first) {
      empty.hidden = false;
      status.hidden = true;
      statusName.textContent = "";
      if (clear) clear.hidden = true;
      return;
    }
    empty.hidden = true;
    status.hidden = false;
    statusName.textContent = first.name;
    if (clear) clear.hidden = false;
  };

  const renderDropzoneFiles = (files: FileList | null) => {
    if (!files || !files.length || !list) return;
    Array.from(files).forEach((file) => {
      const row = document.createElement("div");
      row.className = "blora-upload__row";
      const name = document.createElement("span");
      name.className = "blora-upload__name";
      name.textContent = file.name;
      const size = document.createElement("span");
      size.className = "blora-upload__size";
      size.textContent =
        file.size > 1024 * 1024
          ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
          : Math.round(file.size / 1024) + " KB";
      row.append(name, size);
      list.appendChild(row);
    });
  };

  const applyFiles = (files: FileList | null) => {
    if (compact) showCompactSelection(files);
    else renderDropzoneFiles(files);
    root.dispatchEvent(new Event("change", { bubbles: true }));
  };

  const openPicker = () => {
    if (input!.disabled) return;
    input!.click();
  };
  const onChange = () => applyFiles(input!.files);
  const onOpenClick = (event: Event) => {
    event.preventDefault();
    openPicker();
  };
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };
  const onClear = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    input!.value = "";
    applyFiles(null);
  };

  const openers = compact ? [trigger, empty].filter(Boolean) : [zone];
  openers.forEach((el) => {
    el!.addEventListener("click", onOpenClick);
    el!.addEventListener("keydown", onKeyDown);
  });
  if (!compact && !zone.hasAttribute("tabindex")) zone.tabIndex = 0;
  input.addEventListener("change", onChange);
  clear?.addEventListener("click", onClear);

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    zone.setAttribute("data-dragover", "");
  };
  const onDragLeave = () => zone.removeAttribute("data-dragover");
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    zone.removeAttribute("data-dragover");
    applyFiles(e.dataTransfer?.files ?? null);
  };
  zone.addEventListener("dragover", onDragOver);
  zone.addEventListener("dragleave", onDragLeave);
  zone.addEventListener("drop", onDrop);

  return {
    destroy() {
      openers.forEach((el) => {
        el!.removeEventListener("click", onOpenClick);
        el!.removeEventListener("keydown", onKeyDown);
      });
      input!.removeEventListener("change", onChange);
      clear?.removeEventListener("click", onClear);
      zone.removeEventListener("dragover", onDragOver);
      zone.removeEventListener("dragleave", onDragLeave);
      zone.removeEventListener("drop", onDrop);
    },
  };
}

/** File upload CE that owns dropzone, file input and selected-file list. */
export class BloraUpload extends BloraElement {
  private controller: UploadController | null = null;

  static get observedAttributes(): string[] {
    return ["prompt", "hint", "accept", "multiple", "name", "disabled", "variant"];
  }

  attributeChangedCallback(name: string): void {
    if (!this.isConnectedInternal) return;
    if (name === "variant") {
      this.controller?.destroy();
      this.render();
      this.bindEvents();
      return;
    }
    this.sync();
  }

  get files(): FileList | null {
    return this.querySelector<HTMLInputElement>('input[type="file"]')?.files ?? null;
  }

  override focus(options?: FocusOptions): void {
    this.querySelector<HTMLElement>(".blora-dropzone, .blora-file-picker")?.focus(options);
  }

  open(): void {
    if (!this.hasAttribute("disabled"))
      this.querySelector<HTMLInputElement>('input[type="file"]')?.click();
  }

  protected render(): void {
    const root = this.ownerDocument.createElement("div");
    root.className = "blora-upload";
    root.dataset.bloraGenerated = "";
    const compact = this.getAttribute("variant") === "compact";
    const disabled = this.hasAttribute("disabled");
    const prompt = this.getAttribute("prompt") ?? (compact ? "选择文件" : "拖拽文件至此");
    const hintText =
      this.getAttribute("hint") ?? (compact ? "点击选择或拖拽文件至此" : "选择或拖放文件");
    const input = this.ownerDocument.createElement("input");
    input.className = compact ? "blora-file-picker__input" : "blora-dropzone__input";
    input.type = "file";
    input.name = this.getAttribute("name") ?? "";
    input.accept = this.getAttribute("accept") ?? "";
    input.multiple = this.hasAttribute("multiple");
    input.disabled = disabled;
    input.setAttribute("aria-hidden", "true");

    if (compact) {
      const picker = this.ownerDocument.createElement("div");
      picker.className = "blora-file-picker";
      const trigger = this.ownerDocument.createElement("button");
      trigger.type = "button";
      trigger.className = "blora-file-picker__trigger";
      trigger.disabled = disabled;
      const triggerIcon = createBloraIcon("upload", 18, this.ownerDocument);
      triggerIcon.setAttribute("stroke-width", "1.8");
      const triggerLabel = this.ownerDocument.createElement("span");
      triggerLabel.className = "blora-file-picker__label";
      triggerLabel.textContent = prompt;
      trigger.append(triggerIcon, triggerLabel);
      const empty = this.ownerDocument.createElement("span");
      empty.className = "blora-file-picker__empty";
      empty.textContent = hintText;
      const status = this.ownerDocument.createElement("span");
      status.className = "blora-file-status blora-file-picker__status";
      status.hidden = true;
      const statusName = this.ownerDocument.createElement("span");
      statusName.className = "blora-file-status__name";
      const clear = this.ownerDocument.createElement("button");
      clear.type = "button";
      clear.className = "blora-file-clear";
      clear.hidden = true;
      clear.setAttribute("aria-label", "移除已选文件");
      clear.title = "移除已选文件";
      clear.appendChild(createBloraIcon("close", 14, this.ownerDocument));
      status.append(statusName, clear);
      picker.append(input, trigger, empty, status);
      root.append(picker);
    } else {
      const zone = this.ownerDocument.createElement("div");
      zone.className = "blora-dropzone";
      zone.tabIndex = disabled ? -1 : 0;
      zone.setAttribute("role", "button");
      zone.setAttribute("aria-disabled", String(disabled));
      const icon = this.ownerDocument.createElement("div");
      icon.className = "blora-dropzone__icon";
      const iconSvg = createBloraIcon("upload", 40, this.ownerDocument);
      iconSvg.setAttribute("stroke-width", "1.5");
      icon.appendChild(iconSvg);
      const content = this.ownerDocument.createElement("div");
      content.className = "blora-upload__content";
      const strong = this.ownerDocument.createElement("strong");
      strong.textContent = prompt;
      const action = this.ownerDocument.createElement("span");
      action.textContent = " 或 点击选择";
      content.append(strong, action);
      const hint = this.ownerDocument.createElement("div");
      hint.className = "blora-upload__hint";
      hint.textContent = hintText;
      zone.append(icon, content, hint);
      const list = this.ownerDocument.createElement("div");
      list.className = "blora-upload__list";
      root.append(zone, input, list);
    }
    this.replaceChildren(root);
  }

  protected override sync(): void {
    const root = this.querySelector<HTMLElement>(".blora-upload");
    if (!root) return;
    const compact = this.getAttribute("variant") === "compact";
    const disabled = this.hasAttribute("disabled");
    const input = root.querySelector<HTMLInputElement>('input[type="file"]');
    if (input) {
      input.name = this.getAttribute("name") ?? "";
      input.accept = this.getAttribute("accept") ?? "";
      input.multiple = this.hasAttribute("multiple");
      input.disabled = disabled;
    }
    const prompt = this.getAttribute("prompt") ?? (compact ? "选择文件" : "拖拽文件至此");
    const hintText =
      this.getAttribute("hint") ?? (compact ? "点击选择或拖拽文件至此" : "选择或拖放文件");
    const strong = root.querySelector<HTMLElement>(".blora-upload__content strong");
    if (strong) strong.textContent = this.getAttribute("prompt") ?? "拖拽文件至此";
    const hint = root.querySelector<HTMLElement>(".blora-upload__hint");
    if (hint) hint.textContent = hintText;
    const trigger = root.querySelector<HTMLButtonElement>(".blora-file-picker__trigger");
    if (trigger) {
      const label = trigger.querySelector<HTMLElement>(".blora-file-picker__label");
      if (label) label.textContent = prompt;
      else trigger.textContent = prompt;
      trigger.disabled = disabled;
    }
    const empty = root.querySelector<HTMLElement>(".blora-file-picker__empty");
    if (empty && !empty.hidden) empty.textContent = hintText;
    const zone = root.querySelector<HTMLElement>(".blora-dropzone, .blora-file-picker");
    if (zone) {
      zone.setAttribute("aria-disabled", String(disabled));
      if (!compact) zone.tabIndex = disabled ? -1 : 0;
    }
  }

  protected bindEvents(): void {
    const root = this.querySelector<HTMLElement>(".blora-upload");
    this.controller?.destroy();
    this.controller = null;
    if (root && !this.hasAttribute("disabled")) this.controller = createUploadController(root);
  }

  protected onDisconnect(): void {
    this.controller?.destroy();
    this.controller = null;
  }
}

export function defineBloraUpload(registry: CustomElementRegistry = customElements): void {
  if (!registry || registry.get(BLORA_UPLOAD_TAG)) return;
  registry.define(BLORA_UPLOAD_TAG, BloraUpload);
}
