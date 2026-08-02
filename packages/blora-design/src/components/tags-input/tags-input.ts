/**
 * Blora Design 2.0 - Tags Input controller
 * Enter/comma adds tags; close button removes.
 */
export interface TagsInputController {
  destroy(): void;
}

export function createTagsInputController(root: HTMLElement): TagsInputController {
  const input = root.querySelector<HTMLInputElement>("input");
  if (!input) return { destroy: () => {} };

  const add = (text: string) => {
    const value = text.trim();
    if (!value) return;
    const tag = document.createElement("span");
    tag.className = "blora-tag";
    tag.setAttribute("data-variant", "primary");
    tag.appendChild(document.createTextNode(value));
    const close = document.createElement("button");
    close.type = "button";
    close.className = "blora-tag__close";
    close.setAttribute("aria-label", "移除");
    close.addEventListener("click", () => tag.remove());
    tag.appendChild(close);
    root.insertBefore(tag, input);
    input.value = "";
  };

  // Bind existing close buttons
  root.querySelectorAll(".blora-tag__close").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tag = btn.closest(".blora-tag");
      tag?.remove();
    });
  });

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input.value);
    } else if (e.key === "Backspace" && !input.value) {
      const prev = input.previousElementSibling;
      if (prev?.classList.contains("blora-tag")) prev.remove();
    }
  };

  input.addEventListener("keydown", onKey);

  return {
    destroy() {
      input.removeEventListener("keydown", onKey);
    },
  };
}
