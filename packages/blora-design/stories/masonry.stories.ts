import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Masonry",
  component: ".blora-masonry",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div
      class="blora-masonry"
      style="columns: 3; column-gap: var(--blora-space-3); max-width: 480px;"
    >
      <div
        style="break-inside: avoid; margin-bottom: var(--blora-space-3); background: var(--blora-color-action-primary-default); color: var(--blora-color-text-on-accent); padding: var(--blora-space-4); border-radius: var(--blora-radius-md); height: 120px;"
      >
        A
      </div>
      <div
        style="break-inside: avoid; margin-bottom: var(--blora-space-3); background: var(--blora-color-surface-raised); padding: var(--blora-space-4); border-radius: var(--blora-radius-md); height: 180px;"
      >
        B
      </div>
      <div
        style="break-inside: avoid; margin-bottom: var(--blora-space-3); background: var(--blora-color-status-success); color: white; padding: var(--blora-space-4); border-radius: var(--blora-radius-md); height: 100px;"
      >
        C
      </div>
      <div
        style="break-inside: avoid; margin-bottom: var(--blora-space-3); background: var(--blora-color-surface-sunken); padding: var(--blora-space-4); border-radius: var(--blora-radius-md); height: 150px;"
      >
        D
      </div>
      <div
        style="break-inside: avoid; margin-bottom: var(--blora-space-3); background: var(--blora-color-status-warning); color: white; padding: var(--blora-space-4); border-radius: var(--blora-radius-md); height: 90px;"
      >
        E
      </div>
      <div
        style="break-inside: avoid; margin-bottom: var(--blora-space-3); background: var(--blora-color-surface-raised); padding: var(--blora-space-4); border-radius: var(--blora-radius-md); height: 130px;"
      >
        F
      </div>
    </div>
  `,
};
