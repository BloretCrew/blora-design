import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Mockup",
  component: ".blora-mockup",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-mockup">
      <p class="blora-text-muted">mockup component (beta)</p>
    </div>
  `,
};
