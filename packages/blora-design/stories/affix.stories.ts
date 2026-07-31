import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Affix",
  component: ".blora-affix",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-affix">
      <p class="blora-text-muted">affix component (beta)</p>
    </div>
  `,
};
