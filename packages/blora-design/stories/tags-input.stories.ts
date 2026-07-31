import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Tags Input",
  component: ".blora-tags-input",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-tags-input">
      <p class="blora-text-muted">tags-input component (beta)</p>
    </div>
  `,
};
