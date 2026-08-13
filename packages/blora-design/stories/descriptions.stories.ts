import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data display/Descriptions",
  component: ".blora-descriptions",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <table class="blora-descriptions">
      <tbody>
        <tr>
          <th>用户名</th>
          <td>rhedar</td>
        </tr>
        <tr>
          <th>邮箱</th>
          <td>rhedar@bloret.net</td>
        </tr>
        <tr>
          <th>角色</th>
          <td>管理员</td>
        </tr>
        <tr>
          <th>注册时间</th>
          <td>2024-01-15</td>
        </tr>
        <tr>
          <th>最后登录</th>
          <td>2026-07-31 14:22</td>
        </tr>
      </tbody>
    </table>
  `,
};
