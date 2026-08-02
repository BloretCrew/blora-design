import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createCalendarController } from "../src/components/calendar";

const meta = {
  title: "Data/Calendar",
  component: ".blora-calendar",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createCalendarController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-calendar" style="max-width: 480px;" data-blora-calendar ${ref(init)}></div>
  `,
};
