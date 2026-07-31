import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTimepickerController } from "../src/components/datepicker";

const meta = {
  title: "Forms/Time Picker",
  component: ".blora-timepicker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTimepickerController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="max-width: 20rem;">
      <label class="blora-label" style="margin-bottom: var(--blora-space-2);"
        >时间选择 · Time Picker</label
      >
      <div class="blora-timepicker" ${ref(init)}>
        <input class="blora-input" type="time" value="14:30" placeholder="HH:MM" />
        <button class="blora-timepicker__btn" type="button" aria-label="选择时间" tabindex="-1">
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
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
        </button>
      </div>
    </div>
  `,
};
