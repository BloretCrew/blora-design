import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Foundations/Version",
  tags: ["autodocs"],
  render: () =>
    html`<div style="padding: 2rem; font-family: system-ui">
      <h1>Blora Design 2.0.0-alpha.0</h1>
      <p>Workspace and quality gates established. Components pending migration.</p>
    </div>`,
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {};
