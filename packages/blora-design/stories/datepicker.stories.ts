import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createDatepickerController } from "../src/components/datepicker";

const meta = {
  title: "Forms/Date Picker",
  component: ".blora-datepicker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createDatepickerController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="max-width: 20rem; margin-bottom: 20rem;">
      <label class="blora-label" style="display:block;margin-bottom:var(--blora-space-2);"
        >日期选择 · Date Picker</label
      >
      <div class="blora-datepicker" data-blora-datepicker ${ref(init)}>
        <input
          class="blora-input"
          type="date"
          min="1900-01-01"
          max="2099-12-31"
          placeholder="YYYY-MM-DD"
        />
        <button class="blora-datepicker__btn" type="button" aria-label="选择日期" tabindex="-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
      </div>
    </div>
  `,
};
