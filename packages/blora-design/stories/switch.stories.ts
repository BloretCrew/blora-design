import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraSwitch } from "../src/components/switch";

defineBloraSwitch();

const meta = {
  title: "Data input/Switch",
  component: "blora-switch",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <blora-switch name="notifications" checked>开启通知</blora-switch>
      <blora-switch name="updates">自动更新</blora-switch>
      <blora-switch name="disabled" disabled>禁用</blora-switch>
    </div>
  `,
};

export const Sizes: Story = {
  render: () =>
    html`<div class="blora-row">
      <blora-switch size="sm">小号</blora-switch><blora-switch>默认</blora-switch
      ><blora-switch size="lg">大号</blora-switch>
    </div>`,
};
