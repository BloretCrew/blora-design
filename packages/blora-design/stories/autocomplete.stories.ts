import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/AutoComplete",
  component: ".blora-autocomplete",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-autocomplete">
      <p class="blora-text-muted">autocomplete component (beta)</p>
    </div>
  `,
};
