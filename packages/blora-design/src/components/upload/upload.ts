/**
 * Blora Design 2.0 - Upload controller
 * Click dropzone opens file picker; lists selected file names.
 */
export interface UploadController {
  destroy(): void;
}

export function createUploadController(root: HTMLElement): UploadController {
  const zone = root.querySelector<HTMLElement>(".blora-dropzone, .blora-upload__zone");
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
      row.style.display = "flex";
      row.style.justifyContent = "space-between";
      row.style.alignItems = "center";
      row.style.padding = "0.5em 0.8em";
      row.style.background = "var(--blora-color-surface-raised)";
      row.style.borderRadius = "var(--blora-radius-sm)";
      row.style.marginTop = "var(--blora-space-2)";
      const name = document.createElement("span");
      name.className = "blora-text-sm";
      name.textContent = file.name;
      const size = document.createElement("span");
      size.className = "blora-text-xs blora-text-muted";
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

  zone.addEventListener("click", openPicker);
  zone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  });
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
      input!.removeEventListener("change", onChange);
      zone.removeEventListener("dragover", onDragOver);
      zone.removeEventListener("dragleave", onDragLeave);
      zone.removeEventListener("drop", onDrop);
    },
  };
}
