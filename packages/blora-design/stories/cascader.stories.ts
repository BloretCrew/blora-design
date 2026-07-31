import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Forms/Cascader",
  component: ".blora-cascader",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-cascader">
      <div class="blora-cascader__col">
        <div class="blora-cascader__item" data-selected>广东</div>
        <div class="blora-cascader__item">江苏</div>
        <div class="blora-cascader__item">浙江</div>
      </div>
      <div class="blora-cascader__col">
        <div class="blora-cascader__item" data-selected>深圳</div>
        <div class="blora-cascader__item">广州</div>
        <div class="blora-cascader__item">东莞</div>
      </div>
      <div class="blora-cascader__col">
        <div class="blora-cascader__item" data-selected>南山区</div>
        <div class="blora-cascader__item">福田区</div>
        <div class="blora-cascader__item">罗湖区</div>
      </div>
    </div>
  `,
};
