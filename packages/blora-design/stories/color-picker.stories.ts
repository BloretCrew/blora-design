import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraColorPicker } from "../src/components/color-picker";

defineBloraColorPicker();

const meta = {
  title: "Data input/Color Picker",
  component: "blora-color-picker",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-color-picker value="#3B82F6" style="margin-bottom:16rem;"></blora-color-picker>
  `,
};
