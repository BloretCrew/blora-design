import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Cascader",
  component: ".blora-cascader",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-cascader">
      <p class="blora-text-muted">cascader component (beta)</p>
    </div>
  `,
};
