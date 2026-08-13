import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import type { MentionOption } from "../src/components/mentions";

const meta = {
  title: "Data input/Mentions",
  component: "blora-mentions",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const OPTIONS = ["alice", "bob", "carol", "dave", "张三", "李四"];

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

export const Default: Story = {
  render: () => html`
    <div style="max-width: 28rem; padding-bottom: 14rem;">
      <blora-mentions label="Mentions" placeholder="输入 @ 提及同事 — 菜单贴在 @ 字符旁">
        ${OPTIONS.map((value) => html`<blora-mention value=${value}></blora-mention>`)}
      </blora-mentions>
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
      <blora-mentions
        label="@ 提及（带头像与标签）"
        placeholder="输入 @ 试试 — 列表含头像、名称、副标签"
      >
        ${RICH_OPTIONS.map(
          (option) => html`
            <blora-mention
              value=${option.value}
              label=${option.label ?? option.value}
              initials=${option.initials ?? ""}
              avatar-variant=${option.avatarVariant ?? "info"}
              tag=${option.tag ?? ""}
              keywords=${option.keywords ?? ""}
            ></blora-mention>
          `,
        )}
      </blora-mentions>
      <p
        style="margin-top: 0.75rem; font-size: var(--blora-text-xs); color: var(--blora-color-text-muted);"
      >
        <code>data-options</code> 支持对象： <code>value</code> / <code>label</code> /
        <code>initials</code> / <code>avatar</code> / <code>avatarVariant</code> /
        <code>tag</code>。 插入文本仍是 <code>@value</code>。
      </p>
    </div>
  `,
};
