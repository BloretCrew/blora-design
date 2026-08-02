import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTableController } from "../src/components/table";

const meta = {
  title: "Data/Table",
  component: ".blora-table",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTableController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-table-wrap" ${ref(init)}>
      <table class="blora-table">
        <thead>
          <tr>
            <th data-sort>姓名</th>
            <th data-sort>角色</th>
            <th data-sort>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Alice</td><td>管理员</td><td>活跃</td></tr>
          <tr><td>Bob</td><td>编辑</td><td>离线</td></tr>
          <tr><td>Carol</td><td>访客</td><td>待激活</td></tr>
          <tr><td>Dave</td><td>编辑</td><td>活跃</td></tr>
        </tbody>
      </table>
      <p class="blora-text-xs" style="color:var(--blora-color-text-subtle);margin-top:0.5rem;">点击表头可排序</p>
    </div>
  `,
};
