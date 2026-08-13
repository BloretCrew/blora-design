import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraTimepicker } from "../src/components/timepicker";

defineBloraTimepicker();

const meta = {
  title: "Data input/Time Picker",
  component: "blora-timepicker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="max-width: 16rem; margin-bottom: 18rem;">
      <label class="blora-label" style="display:block;margin-bottom:var(--blora-space-2);"
        >时间选择 · Time Picker</label
      >
      <blora-timepicker name="time" value="14:30" placeholder="HH:MM"></blora-timepicker>
    </div>
  `,
};
