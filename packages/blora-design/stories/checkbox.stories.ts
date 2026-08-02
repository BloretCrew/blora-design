import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createCheckboxController } from "../src/components/checkbox";

const meta = {
  title: "Forms/Checkbox",
  component: ".blora-checkbox",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createCheckboxController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-stack">
      <label class="blora-checkbox"
        ><input type="checkbox" checked /><span class="blora-checkbox__box"></span>同意条款</label
      >
      <label class="blora-checkbox"
        ><input type="checkbox" /><span class="blora-checkbox__box"></span>接收通知</label
      >
      <label class="blora-checkbox"
        ><input type="checkbox" disabled /><span class="blora-checkbox__box"></span>禁用选项</label
      >
    </div>
  `,
};

export const CheckAll: Story = {
  name: "Check all",
  render: () => html`
    <div class="blora-stack" ${ref(init)} style="max-width:16rem;">
      <label class="blora-checkbox"
        ><input type="checkbox" data-blora-checkall /><span class="blora-checkbox__box"></span
        >全选</label
      >
      <label class="blora-checkbox"
        ><input type="checkbox" /><span class="blora-checkbox__box"></span>选项 A</label
      >
      <label class="blora-checkbox"
        ><input type="checkbox" /><span class="blora-checkbox__box"></span>选项 B</label
      >
      <label class="blora-checkbox"
        ><input type="checkbox" /><span class="blora-checkbox__box"></span>选项 C</label
      >
    </div>
  `,
};
