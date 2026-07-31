import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Command Palette",
  component: ".blora-command-palette",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-command-palette">
      <p class="blora-text-muted">command-palette component (beta)</p>
    </div>
  `,
};
