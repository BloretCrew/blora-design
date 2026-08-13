import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createFormController } from "../src/components/form";

const meta = {
  title: "Data input/Form",
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
      <blora-field label="邮箱" name="email" type="email" validate="email" required></blora-field>
      <blora-field label="名称" name="name" minlength="2" required></blora-field>
      <button class="blora-button" type="submit" data-variant="primary">提交</button>
    </form>
  `,
};
