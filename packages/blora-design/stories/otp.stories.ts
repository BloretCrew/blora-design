import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ref } from "lit/directives/ref.js";
import { createOtpController } from "../src/components/otp";

const meta = {
  title: "Forms/OTP",
  component: ".blora-otp",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createOtpController(el);
};

const otpInputs = (count: number) =>
  Array.from(
    { length: count },
    () => '<input class="blora-otp__input" maxlength="1" type="text">',
  ).join("");

export const Numeric6: Story = {
  name: "Numeric (6 digits)",
  render: () => html`
    <div class="blora-otp" data-mode="numeric" ${ref(init)}>${unsafeHTML(otpInputs(6))}</div>
  `,
};

export const Alphanumeric6: Story = {
  name: "Alphanumeric (6 chars)",
  render: () => html`
    <div class="blora-otp" data-mode="alphanumeric" ${ref(init)}>${unsafeHTML(otpInputs(6))}</div>
  `,
};

export const Any4: Story = {
  name: "Any characters (4 chars)",
  render: () => html`
    <div class="blora-otp" data-mode="any" ${ref(init)}>${unsafeHTML(otpInputs(4))}</div>
  `,
};

export const UppercaseAlphanumeric8: Story = {
  name: "Uppercase alphanumeric (8 chars)",
  render: () => html`
    <div class="blora-otp" data-mode="alphanumeric" data-uppercase ${ref(init)}>
      ${unsafeHTML(otpInputs(8))}
    </div>
  `,
};
