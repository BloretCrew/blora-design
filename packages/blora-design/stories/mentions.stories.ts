import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createMentionsController, type MentionOption } from "../src/components/mentions";

const meta = {
  title: "Forms/Mentions",
  component: ".blora-mentions",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const OPTIONS = JSON.stringify(["alice", "bob", "carol", "dave", "张三", "李四"]);

/** Chat-style roster: avatar + name + secondary tag (uses .blora-avatar in menu). */
const RICH_OPTIONS: MentionOption[] = [
  {
    value: "111creator",
    label: "111creator",
    initials: "11",
    avatarVariant: "info",
    tag: "创悦谷负责&策划",
    keywords: "创悦 策划",
  },
  {
    value: "114POPLAR",
    label: "114POPLAR",
    initials: "11",
    avatarVariant: "info",
  },
  {
    value: "123",
    label: "123",
    initials: "12",
    avatarVariant: "info",
  },
  {
    value: "93xiaohao",
    label: "93xiaohao",
    initials: "93",
    avatarVariant: "info",
  },
  {
    value: "Bai_vin",
    label: "Bai_vin",
    initials: "BA",
    avatarVariant: "info",
    tag: "设计系统",
  },
  {
    value: "zhangsan",
    label: "张三",
    initials: "张",
    avatarVariant: "primary",
    tag: "前端",
  },
  {
    value: "lisi",
    label: "李四",
    initials: "李",
    avatarVariant: "success",
    tag: "产品",
  },
];

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  // Defer so Lit finishes attribute hydration
  requestAnimationFrame(() => {
    (el as any).__ctrl?.destroy?.();
    /* Sweep any stray portaled menus left by prior story visits */
    document.querySelectorAll(".blora-mentions__menu").forEach((m) => {
      if (
        !document.querySelector(
          `[data-blora-mentions-id="${m.getAttribute("data-blora-mentions-owner")}"]`,
        )
      ) {
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
      <p
        style="margin-top: 0.75rem; font-size: var(--blora-text-xs); color: var(--blora-color-text-muted);"
      >
        Type @ — menu sits next to the caret (not under the whole field). Flips above near the
        bottom edge.
      </p>
    </div>
  `,
};

/**
 * Rich @ menu: composed from existing Blora pieces
 * (`.blora-avatar` + name + muted secondary tag).
 * Pass objects in `data-options` JSON.
 */
export const RichWithAvatar: Story = {
  name: "Rich (avatar + tag)",
  render: () => html`
    <div style="max-width: 28rem; padding-bottom: 16rem;">
      <div
        class="blora-mentions"
        data-options=${JSON.stringify(RICH_OPTIONS)}
        ${ref(init)}
      >
        <label class="blora-label">@ 提及（带头像与标签）</label>
        <textarea
          class="blora-textarea"
          rows="4"
          placeholder="输入 @ 试试 — 列表含头像、名称、副标签"
        ></textarea>
      </div>
      <p
        style="margin-top: 0.75rem; font-size: var(--blora-text-xs); color: var(--blora-color-text-muted);"
      >
        <code>data-options</code> 支持对象：
        <code>value</code> / <code>label</code> / <code>initials</code> /
        <code>avatar</code> / <code>avatarVariant</code> / <code>tag</code>。 插入文本仍是
        <code>@value</code>。
      </p>
    </div>
  `,
};
