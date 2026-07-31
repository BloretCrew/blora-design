import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createCascaderController } from "../src/components/cascader";

const meta = {
  title: "Forms/Cascader",
  component: ".blora-cascader",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createCascaderController(el);
};

const options = JSON.stringify([
  { label: "技术部", children: [
    { label: "前端组", children: [{ label: "张三" }, { label: "李四" }, { label: "王五" }] },
    { label: "后端组", children: [{ label: "赵六" }, { label: "钱七" }] },
    { label: "设计组", children: [{ label: "孙八" }, { label: "周九" }] },
  ]},
  { label: "产品部", children: [
    { label: "桌面组", children: [{ label: "周十" }, { label: "郑一" }] },
    { label: "市场组", children: [{ label: "吴十" }, { label: "王五" }] },
  ]},
  { label: "运营部", children: [
    { label: "用户组", children: [{ label: "冯二" }, { label: "褚三" }] },
    { label: "客服组", children: [{ label: "卫四" }] },
  ]},
]);

export const Default: Story = {
  render: () => html`
    <div style="max-width: 28rem;">
      <label class="blora-label" style="margin-bottom: var(--blora-space-2);">级联选择 · Cascader</label>
      <div class="blora-cascader" data-options=${options} ${ref(init)}></div>
      <span class="blora-hint blora-cascader__result" style="margin-top: var(--blora-space-2); display: block;">请选择</span>
    </div>
  `,
};
