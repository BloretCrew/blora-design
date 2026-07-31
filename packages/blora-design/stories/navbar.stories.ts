import type { Meta, StoryObj } from "@storybook/web-components";
import { html, svg } from "lit";

const meta = {
  title: "Navigation/Navbar",
  component: ".blora-navbar",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const logo = svg`<svg width="20" height="20" viewBox="0 0 28 28" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M5.565,11.301L8.613,9.556L7.719,7.994L4.671,9.739Q3.715,10.286,3.715,11.388L3.715,21.189Q3.715,22.291,4.671,22.838L13.246,27.747Q14.189,28.287,15.133,27.747L23.708,22.838Q24.664,22.291,24.664,21.189L24.664,11.388Q24.664,10.286,23.708,9.739L15.144,4.837Q14.179,4.284,13.225,4.855L12.236,5.446L13.16,6.991L14.149,6.4Q14.199,6.37,14.25,6.399L22.814,11.301Q22.864,11.33,22.864,11.388L22.864,21.189Q22.864,21.247,22.814,21.276L14.239,26.185Q14.189,26.213,14.14,26.185L5.565,21.276Q5.515,21.247,5.515,21.189L5.515,11.388Q5.515,11.33,5.565,11.301Z"/><path fill-rule="evenodd" d="M13.677,9.829L13.676,2.586Q13.676,1.764,12.959,1.363L11.143,0.35Q10.464,-0.03,9.783,0.347L7.946,1.362Q7.223,1.761,7.223,2.587L7.223,19.635Q7.223,20.457,7.94,20.857L13.577,24.004Q14.268,24.39,14.955,23.997L20.451,20.854Q21.156,20.45,21.156,19.638L21.156,13.368Q21.156,12.542,20.432,12.143L15.607,9.48Q14.897,9.088,14.204,9.509L13.677,9.829ZM11.876,2.821L10.459,2.03L9.023,2.823L9.023,19.4L14.257,22.322L19.356,19.406L19.356,13.605L14.94,11.168L14.003,11.736Q13.303,12.161,12.59,11.759Q11.877,11.358,11.877,10.539L11.876,2.821Z"/><path fill-rule="evenodd" d="M11.362,4.572L13.074,3.671L12.235,2.079L10.462,3.012L8.688,2.079L7.85,3.671L9.562,4.572L9.562,13.982Q9.562,14.794,10.268,15.197L13.398,16.983L13.398,23.356L15.198,23.356L15.198,16.979L20.707,13.792L19.805,12.234L14.295,15.422L11.362,13.749L11.362,4.572Z"/></svg>`;

export const Floating: Story = {
  render: () => html`
    <nav class="blora-navbar" data-variant="floating">
      <div class="blora-navbar__brand">
        <span class="blora-brand-mark">${logo}</span>
        <span class="blora-navbar__title">Blora&nbsp;Design</span>
      </div>
      <div class="blora-navbar__menu">
        <a class="blora-navbar__link" href="#" aria-current="page">设计规范</a>
        <a class="blora-navbar__link" href="#">设计令牌</a>
        <a class="blora-navbar__link" href="#">组件</a>
        <a class="blora-navbar__link" href="#">反馈</a>
      </div>
      <div class="blora-navbar__actions">
        <a class="blora-button" type="button" data-variant="outline" data-size="sm" href="#"
          >规范文档</a
        >
        <button class="blora-button" type="button" data-variant="primary" data-size="sm">
          登录
        </button>
      </div>
    </nav>
  `,
};

export const FullWidth: Story = {
  render: () => html`
    <nav class="blora-navbar" data-variant="full">
      <div class="blora-navbar__brand">
        <span class="blora-brand-mark">${logo}</span>
        <span class="blora-navbar__title">Blora&nbsp;Design</span>
      </div>
      <div class="blora-navbar__menu">
        <a class="blora-navbar__link" href="#" aria-current="page">首页</a>
        <a class="blora-navbar__link" href="#">文档</a>
        <a class="blora-navbar__link" href="#">组件</a>
      </div>
      <div class="blora-navbar__actions">
        <button class="blora-button" type="button" data-variant="primary" data-size="sm">
          登录
        </button>
      </div>
    </nav>
  `,
};
