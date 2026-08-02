/**
 * Blora Design 2.0 - Transfer controller
 * Moves checked items between source and target panels.
 */
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
      sourceHead.textContent = `候选 · ${count}`;
    }
    if (targetHead) {
      const count = targetList?.querySelectorAll(".blora-transfer__row").length ?? 0;
      targetHead.textContent = `已选 · ${count}`;
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
