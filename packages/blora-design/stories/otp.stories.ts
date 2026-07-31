import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = { title: "Forms/OTP", component: ".blora-otp", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-otp">
      <input class="blora-otp__input" type="text" maxlength="1" value="8" />
      <input class="blora-otp__input" type="text" maxlength="1" value="3" />
      <input class="blora-otp__input" type="text" maxlength="1" />
      <input class="blora-otp__input" type="text" maxlength="1" />
      <input class="blora-otp__input" type="text" maxlength="1" />
      <input class="blora-otp__input" type="text" maxlength="1" />
    </div>
  `,
};
