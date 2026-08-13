import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Splitter",
  component: "blora-splitter",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-splitter min="100" position="45" style="min-height:10rem;">
      <blora-splitter-pane
        style="background:var(--blora-color-surface-raised);display:grid;place-items:center;padding:var(--blora-space-4);"
        >左栏 · 拖拽中间条</blora-splitter-pane
      >
      <blora-splitter-pane style="display:grid;place-items:center;padding:var(--blora-space-4);"
        >右栏 · 自适应</blora-splitter-pane
      >
    </blora-splitter>
  `,
};
