import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraOtp } from "../src/components/otp";

defineBloraOtp();

const meta = {
  title: "Data input/OTP",
  component: "blora-otp",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Numeric6: Story = {
  name: "Numeric (6 digits)",
  render: () => html`<blora-otp length="6" mode="numeric"></blora-otp>`,
};

export const Alphanumeric6: Story = {
  name: "Alphanumeric (6 chars)",
  render: () => html`<blora-otp length="6" mode="alphanumeric"></blora-otp>`,
};

export const Any4: Story = {
  name: "Any characters (4 chars)",
  render: () => html`<blora-otp length="4" mode="any"></blora-otp>`,
};

export const UppercaseAlphanumeric8: Story = {
  name: "Uppercase alphanumeric (8 chars)",
  render: () => html`<blora-otp length="8" mode="alphanumeric" uppercase></blora-otp>`,
};
