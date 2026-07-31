import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Switch",
  component: ".blora-switch",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <label class="blora-switch"
        ><input type="checkbox" checked /><span class="blora-switch__track"></span
        ><span class="blora-text-sm">开启通知</span></label
      >
      <label class="blora-switch"
        ><input type="checkbox" /><span class="blora-switch__track"></span
        ><span class="blora-text-sm">自动更新</span></label
      >
      <label class="blora-switch"
        ><input type="checkbox" disabled /><span class="blora-switch__track"></span
        ><span class="blora-text-sm">禁用</span></label
      >
    </div>
  `,
};
