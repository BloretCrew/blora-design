import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTreeController } from "../src/components/tree";

const meta = {
  title: "Data/Tree",
  component: ".blora-tree",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTreeController(el);
};

const chevron = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>';
const folder = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>';

export const Default: Story = {
  render: () => html`
    <div class="blora-tree" style="max-width:300px;" ${ref(init)}>
      <div class="blora-tree__node" data-open data-selected>
        <span class="blora-tree__toggle">${chevron}</span>${folder}<span>技术部</span>
      </div>
      <div class="blora-tree__children">
        <div class="blora-tree__node" data-open>
          <span class="blora-tree__toggle">${chevron}</span>${folder}<span>前端组</span>
        </div>
        <div class="blora-tree__children">
          <div class="blora-tree__node"><span style="width:1em;"></span><span>张三</span></div>
          <div class="blora-tree__node"><span style="width:1em;"></span><span>李四</span></div>
          <div class="blora-tree__node"><span style="width:1em;"></span><span>王五</span></div>
        </div>
        <div class="blora-tree__node">
          <span class="blora-tree__toggle">${chevron}</span>${folder}<span>设计组</span>
        </div>
        <div class="blora-tree__children">
          <div class="blora-tree__node"><span style="width:1em;"></span><span>赵六</span></div>
          <div class="blora-tree__node"><span style="width:1em;"></span><span>孙八</span></div>
        </div>
      </div>
    </div>
  `,
};
