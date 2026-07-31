import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Search",
  component: ".blora-search",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-search">
      <p class="blora-text-muted">search component (beta)</p>
    </div>
  `,
};
