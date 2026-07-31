import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Chart Container",
  component: ".blora-chart-container",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-chart-container">
      <p class="blora-text-muted">chart-container component (beta)</p>
    </div>
  `,
};
