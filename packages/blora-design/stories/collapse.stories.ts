import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Collapse",
  component: ".blora-collapse",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const toggle = (e: Event): void => {
  const head = (e.target as HTMLElement).closest(".blora-collapse__head");
  const item = head?.closest(".blora-collapse__item");
  item?.toggleAttribute("data-open");
};

export const Default: Story = {
  render: () => html`
    <div class="blora-collapse" @click=${toggle}>
      <div class="blora-collapse__item" data-open>
        <button class="blora-collapse__head" type="button">
          <span>什么是 Blora Design？</span>
          <span class="blora-collapse__icon">▸</span>
        </button>
        <div class="blora-collapse__body">
          <div class="blora-collapse__content">
            一套基于 Web 标准的令牌驱动 UI 设计系统，支持纯 HTML、原生 JS 和主流框架。
          </div>
        </div>
      </div>
      <div class="blora-collapse__item" data-open>
        <button class="blora-collapse__head" type="button">
          <span>如何安装？</span>
          <span class="blora-collapse__icon">▸</span>
        </button>
        <div class="blora-collapse__body">
          <div class="blora-collapse__content">
            通过 npm 安装：<code class="blora-code">npm i @bloret-crew/blora-design</code>
          </div>
        </div>
      </div>
      <div class="blora-collapse__item">
        <button class="blora-collapse__head" type="button">
          <span>支持哪些浏览器？</span>
          <span class="blora-collapse__icon">▸</span>
        </button>
        <div class="blora-collapse__body">
          <div class="blora-collapse__content">
            支持所有现代浏览器（Chrome、Firefox、Safari、Edge 最新版）。
          </div>
        </div>
      </div>
    </div>
  `,
};
