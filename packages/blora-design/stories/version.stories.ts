import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Foundations/Version",
  tags: ["autodocs"],
  render: () =>
    html`<div style="padding: 2rem; font-family: system-ui">
      <h1>Blora Design 2.0.0-beta.0</h1>
      <p>Stable-core API frozen; RC quality work in progress.</p>
    </div>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
