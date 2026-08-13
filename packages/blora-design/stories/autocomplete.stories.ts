import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data input/Autocomplete",
  component: "blora-autocomplete",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-autocomplete label="AutoComplete" placeholder="搜索组件…">
      ${["Blora Design", "Button", "Badge", "Drawer", "Modal", "Table", "Message"].map(
        (value) => html`<blora-autocomplete-option value=${value}></blora-autocomplete-option>`,
      )}
    </blora-autocomplete>
  `,
};
