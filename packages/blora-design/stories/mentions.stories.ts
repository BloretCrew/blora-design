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
    (el as any).__ctrl?.destroy?.();
    /* Sweep any stray portaled menus left by prior story visits */
    document.querySelectorAll(".blora-mentions__menu").forEach((m) => {
      if (!document.querySelector(`[data-blora-mentions-id="${m.getAttribute("data-blora-mentions-owner")}"]`)) {
        m.remove();
      }
    });
    (el as any).__ctrl = createMentionsController(el);
    // Do not auto-open: user types @ to open (avoids ghost menus on navigation)
  });
};

export const Default: Story = {
  render: () => html`
    <div style="max-width: 28rem; padding-bottom: 14rem;">
      <div class="blora-mentions" data-options=${OPTIONS} ${ref(init)}>
        <label class="blora-label">Mentions</label>
        <textarea
          class="blora-textarea"
          rows="4"
          placeholder="输入 @ 提及同事 — 菜单贴在 @ 字符旁"
        ></textarea>
      </div>
      <p style="margin-top: 0.75rem; font-size: var(--blora-text-xs); color: var(--blora-color-text-muted);">
        Type @ — menu sits next to the caret (not under the whole field). Flips above near the bottom edge.
      </p>
    </div>
  `,
};
