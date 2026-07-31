import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";

const meta = {
  title: "Forms/Segmented",
  component: ".blora-segmented",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const initSegmented = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  const items = Array.from(el.querySelectorAll<HTMLElement>(".blora-segmented__item"));
  const indicator = el.querySelector<HTMLElement>(".blora-segmented__indicator");
  if (!indicator) return;

  const moveIndicator = (item: HTMLElement, instant: boolean): void => {
    const rect = item.getBoundingClientRect();
    const parentRect = el.getBoundingClientRect();
    if (instant) indicator.style.transition = "none";
    indicator.style.left = `${rect.left - parentRect.left}px`;
    indicator.style.width = `${rect.width}px`;
    if (instant) requestAnimationFrame(() => (indicator.style.transition = ""));
  };

  const active = items.find((i) => i.hasAttribute("data-active")) ?? items[0];
  if (active) {
    items.forEach((i) => i.removeAttribute("data-active"));
    active.setAttribute("data-active", "");
    requestAnimationFrame(() => moveIndicator(active, true));
  }

  items.forEach((item) => {
    item.addEventListener("click", () => {
      items.forEach((i) => i.removeAttribute("data-active"));
      item.setAttribute("data-active", "");
      moveIndicator(item, false);
    });
  });
};

export const Default: Story = {
  render: () => html`
    <div class="blora-segmented" ${ref(initSegmented)}>
      <span class="blora-segmented__indicator"></span>
      <button class="blora-segmented__item" data-active type="button">日</button>
      <button class="blora-segmented__item" type="button">周</button>
      <button class="blora-segmented__item" type="button">月</button>
      <button class="blora-segmented__item" type="button">年</button>
    </div>
  `,
};
