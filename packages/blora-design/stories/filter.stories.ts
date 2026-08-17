import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = {
  title: "Data input/Filter",
  component: ".blora-filter",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Default: Story = {
  render: () =>
    html`<form class="blora-filter" aria-label="状态筛选">
      <label class="blora-filter__item"
        ><input type="radio" name="status" /><span class="blora-filter__label">全部</span></label
      ><label class="blora-filter__item"
        ><input type="radio" name="status" /><span class="blora-filter__label">进行中</span></label
      ><label class="blora-filter__item"
        ><input type="radio" name="status" /><span class="blora-filter__label">已完成</span></label
      ><button class="blora-filter__reset" type="reset">清除</button>
    </form>`,
};
