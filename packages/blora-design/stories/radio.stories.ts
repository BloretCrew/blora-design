import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Radio",
  component: ".blora-radio",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <label class="blora-radio"
        ><input type="radio" name="r1" checked /><span class="blora-radio__dot"></span>选项 A</label
      >
      <label class="blora-radio"
        ><input type="radio" name="r1" /><span class="blora-radio__dot"></span>选项 B</label
      >
      <label class="blora-radio"
        ><input type="radio" name="r1" disabled /><span class="blora-radio__dot"></span>选项 C
        (禁用)</label
      >
    </div>
  `,
};
