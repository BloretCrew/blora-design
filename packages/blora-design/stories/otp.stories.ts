import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/OTP",
  component: ".blora-otp",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-otp">
      <p class="blora-text-muted">otp component (beta)</p>
    </div>
  `,
};
