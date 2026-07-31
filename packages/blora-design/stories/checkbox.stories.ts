import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Checkbox",
  component: ".blora-checkbox",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <label class="blora-checkbox"
        ><input type="checkbox" checked /><span class="blora-checkbox__box"></span>同意条款</label
      >
      <label class="blora-checkbox"
        ><input type="checkbox" /><span class="blora-checkbox__box"></span>接收通知</label
      >
      <label class="blora-checkbox"
        ><input type="checkbox" disabled /><span class="blora-checkbox__box"></span>禁用选项</label
      >
    </div>
  `,
};
