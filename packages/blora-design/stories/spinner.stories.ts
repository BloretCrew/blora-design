import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Spinner",
  component: ".blora-spinner",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-row">
      <span class="blora-spinner" role="status" aria-label="Loading"></span>
      <span class="blora-spinner" data-size="sm" role="status"></span>
      <span class="blora-spinner" data-size="lg" role="status"></span>
    </div>
  `,
};
