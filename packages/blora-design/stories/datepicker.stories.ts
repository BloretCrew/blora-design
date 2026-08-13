import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraDatepicker } from "../src/components/datepicker";

defineBloraDatepicker();

const meta = {
  title: "Data input/Date Picker",
  component: "blora-datepicker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="max-width: 20rem; margin-bottom: 20rem;">
      <label class="blora-label" style="display:block;margin-bottom:var(--blora-space-2);"
        >日期选择 · Date Picker</label
      >
      <blora-datepicker
        name="date"
        min="1900-01-01"
        max="2099-12-31"
        placeholder="YYYY-MM-DD"
      ></blora-datepicker>
    </div>
  `,
};
