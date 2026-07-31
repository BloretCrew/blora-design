import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createFieldController } from "../src/components/copy";

const meta = {
  title: "Forms/Field",
  component: ".blora-field",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createFieldController(el);
};

export const Default: Story = {
  render: () => html`
    <div style="display: grid; gap: var(--blora-space-5); max-width: 28rem;" ${ref(init)}>
      <div class="blora-field">
        <label class="blora-label" for="f-text">文本输入</label>
        <input
          class="blora-input"
          id="f-text"
          type="text"
          placeholder="请输入用户名"
          data-limit="20"
        />
        <span class="blora-hint">最长 20 个字符，超出后标红，不会截断输入。</span>
      </div>
      <div class="blora-field">
        <label class="blora-label" for="f-err">错误态</label>
        <input
          class="blora-input"
          id="f-err"
          type="text"
          value="invalid input"
          data-variant="error"
        />
        <span class="blora-error">此处输入无效，请重新填写。</span>
      </div>
      <div class="blora-field">
        <label class="blora-label" for="f-dis">禁用</label>
        <input class="blora-input" id="f-dis" type="text" value="此项不可编辑" disabled />
      </div>
    </div>
  `,
};
