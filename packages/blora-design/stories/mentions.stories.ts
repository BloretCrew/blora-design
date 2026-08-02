import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createMentionsController } from "../src/components/mentions";

const meta = {
  title: "Forms/Mentions",
  component: ".blora-mentions",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const OPTIONS = JSON.stringify(["alice", "bob", "carol", "dave", "张三", "李四"]);

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  // Defer so Lit finishes attribute hydration
  requestAnimationFrame(() => {
    (el as any).__ctrl?.destroy();
    (el as any).__ctrl = createMentionsController(el);
  });
};

export const Default: Story = {
  render: () => html`
    <div
      class="blora-mentions"
      data-options=${OPTIONS}
      style="max-width: 22rem; margin-bottom: 12rem;"
      ${ref(init)}
    >
      <label class="blora-label">Mentions</label>
      <textarea class="blora-textarea" rows="3" placeholder="输入 @ 提及同事"></textarea>
    </div>
  `,
};
