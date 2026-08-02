import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTreeSelectController } from "../src/components/tree-select";

const meta = {
  title: "Forms/Tree Select",
  component: ".blora-treeselect",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const OPTIONS = JSON.stringify([
  {
    label: "华东",
    value: "east",
    children: [
      { label: "上海", value: "sh" },
      { label: "杭州", value: "hz" },
    ],
  },
  {
    label: "华北",
    value: "north",
    children: [
      { label: "北京", value: "bj" },
      { label: "天津", value: "tj" },
    ],
  },
]);

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy?.();
  (el as any).__ctrl = createTreeSelectController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-treeselect" data-options=${OPTIONS} ${ref(init)}>
      <label class="blora-label">地区</label>
      <input class="blora-input" type="text" placeholder="选择地区" readonly />
    </div>
  `,
};
