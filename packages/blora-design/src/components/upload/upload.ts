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

  let input = root.querySelector<HTMLInputElement>('input[type="file"]');
  if (!input) {
    input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.hidden = true;
    input.setAttribute("aria-hidden", "true");
    root.appendChild(input);
  }

  let list = root.querySelector<HTMLElement>(".blora-upload__list, .blora-stack");
  if (!list) {
    list = document.createElement("div");
    list.className = "blora-upload__list";
    list.style.marginTop = "var(--blora-space-3)";
    root.appendChild(list);
  }

  const renderFiles = (files: FileList | null) => {
    if (!files || !files.length || !list) return;
    // Append demo rows for selected files
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
      list!.appendChild(row);
    });
  };

  const openPicker = () => input!.click();
  const onChange = () => renderFiles(input!.files);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  zone.addEventListener("click", openPicker);
  zone.addEventListener("keydown", onKeyDown);
  if (!zone.hasAttribute("tabindex")) zone.tabIndex = 0;
  if (!zone.getAttribute("role")) zone.setAttribute("role", "button");
  input.addEventListener("change", onChange);

  // drag & drop
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    zone.setAttribute("data-dragover", "");
  };
  const onDragLeave = () => zone.removeAttribute("data-dragover");
  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    zone.removeAttribute("data-dragover");
    renderFiles(e.dataTransfer?.files ?? null);
  };
  zone.addEventListener("dragover", onDragOver);
  zone.addEventListener("dragleave", onDragLeave);
  zone.addEventListener("drop", onDrop);

  return {
    destroy() {
      zone.removeEventListener("click", openPicker);
      zone.removeEventListener("keydown", onKeyDown);
      input!.removeEventListener("change", onChange);
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
    const zone = this.ownerDocument.createElement(compact ? "button" : "div");
    zone.className = compact ? "blora-file-picker" : "blora-dropzone";
    if (compact) {
      (zone as HTMLButtonElement).type = "button";
      (zone as HTMLButtonElement).disabled = disabled;
    }
    zone.tabIndex = disabled ? -1 : 0;
    zone.setAttribute("role", "button");
    zone.setAttribute("aria-disabled", String(disabled));
    const icon = this.ownerDocument.createElement("div");
    icon.className = "blora-dropzone__icon";
    const iconSvg = createBloraIcon("upload", 40);
    iconSvg.setAttribute("stroke-width", "1.5");
    icon.appendChild(iconSvg);
    const content = this.ownerDocument.createElement("div");
    content.className = "blora-upload__content";
    const strong = this.ownerDocument.createElement("strong");
    strong.textContent = this.getAttribute("prompt") ?? "拖拽文件至此";
    const action = this.ownerDocument.createElement("span");
    action.textContent = " 或 点击选择";
    content.append(strong, action);
    const hint = this.ownerDocument.createElement("div");
    hint.className = "blora-upload__hint";
    hint.textContent = this.getAttribute("hint") ?? "选择或拖放文件";
    if (compact) {
      const compactLabel = this.ownerDocument.createElement("span");
      compactLabel.className = "blora-file-picker__label";
      compactLabel.textContent = this.getAttribute("prompt") ?? "选择文件";
      zone.append(icon, compactLabel);
      zone.setAttribute("aria-label", compactLabel.textContent);
    } else {
      zone.append(icon, content, hint);
    }
    const input = this.ownerDocument.createElement("input");
    input.className = "blora-dropzone__input";
    input.type = "file";
    input.name = this.getAttribute("name") ?? "";
    input.accept = this.getAttribute("accept") ?? "";
    input.multiple = this.hasAttribute("multiple");
    input.disabled = disabled;
    const list = this.ownerDocument.createElement("div");
    list.className = "blora-upload__list";
    root.append(zone, input, list);
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
    const hintText = this.getAttribute("hint") ?? "选择或拖放文件";
    const strong = root.querySelector<HTMLElement>(".blora-upload__content strong");
    if (strong) strong.textContent = this.getAttribute("prompt") ?? "拖拽文件至此";
    const hint = root.querySelector<HTMLElement>(".blora-upload__hint");
    if (hint) hint.textContent = hintText;
    const compactLabel = root.querySelector<HTMLElement>(".blora-file-picker__label");
    if (compactLabel) compactLabel.textContent = prompt;
    const zone = root.querySelector<HTMLElement>(".blora-dropzone, .blora-file-picker");
    if (zone) {
      zone.tabIndex = disabled ? -1 : 0;
      zone.setAttribute("aria-disabled", String(disabled));
      if (zone instanceof HTMLButtonElement) zone.disabled = disabled;
      if (compactLabel) zone.setAttribute("aria-label", compactLabel.textContent ?? prompt);
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
