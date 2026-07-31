import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Upload",
  component: ".blora-upload",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-upload">
      <p class="blora-text-muted">upload component (beta)</p>
    </div>
  `,
};
