import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraCollapse } from "../src/components/collapse";

defineBloraCollapse();

const meta = {
  title: "Data display/Collapse",
  component: "blora-collapse",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <blora-collapse style="max-width: 28rem;">
      <blora-collapse-item heading="什么是 Blora Design？" open>
        一套基于 Web 标准的令牌驱动 UI 设计系统。
      </blora-collapse-item>
      <blora-collapse-item heading="如何安装？">
        <code class="blora-code">pnpm add @bloret-crew/blora-design</code>
      </blora-collapse-item>
      <blora-collapse-item heading="支持哪些浏览器？">
        现代 Chromium / Firefox / Safari。
      </blora-collapse-item>
    </blora-collapse>
  `,
};
