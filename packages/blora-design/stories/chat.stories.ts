import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Chat",
  component: ".blora-chat",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-chat">
      <p class="blora-text-muted">chat component (beta)</p>
    </div>
  `,
};
