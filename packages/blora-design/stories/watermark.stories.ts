import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Watermark",
  component: ".blora-watermark",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-watermark">
      <p class="blora-text-muted">watermark component (beta)</p>
    </div>
  `,
};
