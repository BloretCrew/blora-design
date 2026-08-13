import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraCheckbox } from "../src/components/checkbox";

defineBloraCheckbox();

const meta = {
  title: "Data input/Checkbox",
  component: "blora-checkbox",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <blora-checkbox checked>同意条款</blora-checkbox>
      <blora-checkbox>接收通知</blora-checkbox>
      <blora-checkbox disabled>禁用选项</blora-checkbox>
    </div>
  `,
};

export const CheckAll: Story = {
  name: "Check all",
  render: () => html`
    <blora-checkbox name="options" label="批量选择" style="max-width:16rem;">
      <blora-checkbox-option check-all>全选</blora-checkbox-option>
      <blora-checkbox-option value="a">选项 A</blora-checkbox-option>
      <blora-checkbox-option value="b">选项 B</blora-checkbox-option>
      <blora-checkbox-option value="c">选项 C</blora-checkbox-option>
    </blora-checkbox>
  `,
};
