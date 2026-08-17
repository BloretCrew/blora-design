import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraNumberInput } from "../src/components/number-input";
defineBloraNumberInput();
const meta = {
  title: "Data input/Number Input",
  component: "blora-number-input",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<blora-number-input
      label="数量"
      value="3"
      min="0"
      max="10"
      step="1"
    ></blora-number-input>`,
};
export const Disabled: Story = {
  render: () => html`<blora-number-input label="不可编辑" value="3" disabled></blora-number-input>`,
};
