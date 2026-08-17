import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Footer",
  component: ".blora-footer",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <footer class="blora-footer">
      <div class="blora-footer__inner">
        <div>
          <div class="blora-footer__title">Blora Design</div>
          <p>令牌驱动的 Web UI 框架。</p>
        </div>
        <div>
          <div class="blora-footer__title">文档</div>
          <a class="blora-footer__link" href="#footer">指南</a>
          <a class="blora-footer__link" href="#footer">契约</a>
        </div>
        <div>
          <div class="blora-footer__title">组件</div>
          <a class="blora-footer__link" href="#footer">按钮</a>
          <a class="blora-footer__link" href="#footer">表单</a>
        </div>
        <div>
          <div class="blora-footer__title">社区</div>
          <a class="blora-footer__link" href="#footer">GitHub</a>
        </div>
      </div>
      <div class="blora-footer__bottom">© Bloret Crew</div>
    </footer>
  `,
};
