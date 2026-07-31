import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createOtpController } from "../src/components/otp";

const meta = {
  title: "Forms/OTP",
  component: ".blora-otp",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

// Defer controller creation until after Lit commits the child inputs
const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  setTimeout(() => {
    (el as any).__ctrl?.destroy();
    (el as any).__ctrl = createOtpController(el);
  }, 0);
};

const otpInputs = (count: number) =>
  Array.from(
    { length: count },
    () => html`<input class="blora-otp__input" maxlength="1" type="text" />`,
  );

export const Numeric6: Story = {
  name: "Numeric (6 digits)",
  render: () => html`
    <div class="blora-otp" data-mode="numeric" ${ref(init)}>
      ${otpInputs(6)}
    </div>
  `,
};

export const Alphanumeric6: Story = {
  name: "Alphanumeric (6 chars)",
  render: () => html`
    <div class="blora-otp" data-mode="alphanumeric" ${ref(init)}>
      ${otpInputs(6)}
    </div>
  `,
};

export const Any4: Story = {
  name: "Any characters (4 chars)",
  render: () => html`
    <div class="blora-otp" data-mode="any" ${ref(init)}>
      ${otpInputs(4)}
    </div>
  `,
};

export const UppercaseAlphanumeric8: Story = {
  name: "Uppercase alphanumeric (8 chars)",
  render: () => html`
    <div class="blora-otp" data-mode="alphanumeric" data-uppercase ${ref(init)}>
      ${otpInputs(8)}
    </div>
  `,
};
