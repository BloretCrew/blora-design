import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Megamenu",
  component: "blora-megamenu",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="margin-bottom: 14rem;">
      <blora-megamenu label="浏览产品">
        <blora-megamenu-section title="工作"
          ><a href="#projects">项目管理</a><a href="#tasks">任务中心</a></blora-megamenu-section
        >
        <blora-megamenu-section title="数据"
          ><a href="#analytics">分析面板</a><a href="#exports">导出记录</a></blora-megamenu-section
        >
        <blora-megamenu-section title="支持"
          ><a href="#help">帮助中心</a><a href="#status">服务状态</a></blora-megamenu-section
        >
      </blora-megamenu>
    </div>
  `,
};
