import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Table",
  component: ".blora-table",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div class="blora-table-wrap">
      <table class="blora-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>角色</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alice</td>
            <td>管理员</td>
            <td>活跃</td>
          </tr>
          <tr>
            <td>Bob</td>
            <td>编辑</td>
            <td>离线</td>
          </tr>
          <tr>
            <td>Carol</td>
            <td>访客</td>
            <td>待激活</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};

export const Striped: Story = {
  render: () => html`
    <div class="blora-table-wrap">
      <table class="blora-table" data-striped>
        <thead>
          <tr>
            <th>产品</th>
            <th>价格</th>
            <th>库存</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>键盘</td>
            <td>¥299</td>
            <td>120</td>
          </tr>
          <tr>
            <td>鼠标</td>
            <td>¥99</td>
            <td>340</td>
          </tr>
          <tr>
            <td>显示器</td>
            <td>¥1899</td>
            <td>45</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
};
