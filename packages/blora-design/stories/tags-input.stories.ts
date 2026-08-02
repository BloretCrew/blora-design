import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createTagsInputController } from "../src/components/tags-input";

const meta = {
  title: "Forms/Tags Input",
  component: ".blora-tags-input",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createTagsInputController(el);
};

export const Default: Story = {
  render: () => html`
    <div class="blora-tags-input" ${ref(init)}>
      <span class="blora-tag" data-variant="primary"
        >React<button class="blora-tag__close" type="button" aria-label="移除"></button
      ></span>
      <span class="blora-tag" data-variant="primary"
        >Vue<button class="blora-tag__close" type="button" aria-label="移除"></button
      ></span>
      <span class="blora-tag" data-variant="primary"
        >Svelte<button class="blora-tag__close" type="button" aria-label="移除"></button
      ></span>
      <input type="text" placeholder="添加标签..." />
    </div>
  `,
};
