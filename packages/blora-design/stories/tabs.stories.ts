import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTabsController } from "../src/components/tabs";

const meta = {
  title: "Navigation/Tabs",
  component: ".blora-tabs",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Initialize the tabs controller on a root element. */
const initTabs = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  const prev = (el as HTMLElement & { __tabsController?: { destroy: () => void } })
    .__tabsController;
  prev?.destroy();
  (el as HTMLElement & { __tabsController?: { destroy: () => void } }).__tabsController =
    createTabsController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-tabs" ${ref(initTabs)}>
      <div class="blora-tabs__nav">
        <button class="blora-tabs__tab" aria-selected="true">概览</button>
        <button class="blora-tabs__tab">活动</button>
        <button class="blora-tabs__tab">设置</button>
      </div>
      <div class="blora-tabs__panel">概览内容区域</div>
      <div class="blora-tabs__panel" style="display:none">活动内容区域</div>
      <div class="blora-tabs__panel" style="display:none">设置内容区域</div>
    </div>
  `,
};

export const Pills: Story = {
  render: () => html`
    <div class="blora-tabs" data-variant="pills" ${ref(initTabs)}>
      <div class="blora-tabs__nav">
        <button class="blora-tabs__tab" aria-selected="true">标签一</button>
        <button class="blora-tabs__tab">标签二</button>
        <button class="blora-tabs__tab">标签三</button>
      </div>
      <div class="blora-tabs__panel">标签一内容</div>
      <div class="blora-tabs__panel" style="display:none">标签二内容</div>
      <div class="blora-tabs__panel" style="display:none">标签三内容</div>
    </div>
  `,
};

export const Vertical: Story = {
  render: () => html`
    <div class="blora-tabs" data-orientation="vertical" ${ref(initTabs)}>
      <div class="blora-tabs__nav">
        <button class="blora-tabs__tab" aria-selected="true">概览</button>
        <button class="blora-tabs__tab">活动</button>
        <button class="blora-tabs__tab">设置</button>
      </div>
      <div class="blora-tabs__panel">概览内容区域</div>
      <div class="blora-tabs__panel" style="display:none">活动内容区域</div>
      <div class="blora-tabs__panel" style="display:none">设置内容区域</div>
    </div>
  `,
};
