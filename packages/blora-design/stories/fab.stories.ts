import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/FAB",
  component: ".blora-fab",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-fab">
      <p class="blora-text-muted">fab component (beta)</p>
    </div>
  `,
};
