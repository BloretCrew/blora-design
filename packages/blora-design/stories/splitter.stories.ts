import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Splitter",
  component: ".blora-splitter",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-splitter">
      <p class="blora-text-muted">splitter component (beta)</p>
    </div>
  `,
};
