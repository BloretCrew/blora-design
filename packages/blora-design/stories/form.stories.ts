import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createFormController } from "../src/components/form";

const meta = {
  title: "Forms/Form Validate",
  component: "form.blora-form",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLFormElement)) return;
  (el as any).__ctrl?.destroy?.();
  (el as any).__ctrl = createFormController(el);
};

export const Default: Story = {
  render: () => html`
    <form class="blora-form" data-blora-form ${ref(init)} style="max-width: 22rem;">
      <div class="blora-field">
        <label class="blora-field__label" data-required>邮箱</label>
        <input class="blora-input" name="email" type="email" required data-blora-validate="email" />
        <div class="blora-field__error" hidden></div>
      </div>
      <div class="blora-field">
        <label class="blora-field__label" data-required>名称</label>
        <input class="blora-input" name="name" type="text" required minlength="2" />
        <div class="blora-field__error" hidden></div>
      </div>
      <button class="blora-button" type="submit" data-variant="primary">提交</button>
    </form>
  `,
};
