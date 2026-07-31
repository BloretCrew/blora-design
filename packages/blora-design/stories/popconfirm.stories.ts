import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";

const meta = {
  title: "Feedback/Popconfirm",
  component: ".blora-popconfirm",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const initPopconfirm = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  const trigger = el.querySelector<HTMLElement>("[data-popconfirm-trigger]");
  if (!trigger) return;

  trigger.addEventListener("click", (e) => {
    e.stopPropagation();
    el.toggleAttribute("data-open");
  });

  el.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-popconfirm-confirm]") || target.closest("[data-popconfirm-cancel]")) {
      el.removeAttribute("data-open");
    }
  });

  document.addEventListener("click", () => {
    if (el.hasAttribute("data-open")) el.removeAttribute("data-open");
  });
};

export const Default: Story = {
  render: () => html`
    <div class="blora-popconfirm" ${ref(initPopconfirm)}>
      <button class="blora-button" type="button" data-variant="danger" data-popconfirm-trigger>
        删除
      </button>
      <div class="blora-popconfirm__panel" role="alertdialog">
        <div class="blora-popconfirm__title">确定要删除这项内容吗？</div>
        <div class="blora-popconfirm__actions">
          <button
            class="blora-button"
            type="button"
            data-variant="outline"
            data-size="sm"
            data-popconfirm-cancel
          >
            取消
          </button>
          <button
            class="blora-button"
            type="button"
            data-variant="danger"
            data-size="sm"
            data-popconfirm-confirm
          >
            确定
          </button>
        </div>
      </div>
    </div>
  `,
};
