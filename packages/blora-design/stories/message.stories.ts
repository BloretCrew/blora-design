import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { createMessageElement, message, type MessageType } from "../src/components/message";

const meta = {
  title: "Feedback/Message",
  component: ".blora-message",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const mountVariants = (element: Element | undefined): void => {
  if (!(element instanceof HTMLElement)) return;
  const variants: Array<[MessageType, string]> = [
    ["info", "这是一条提示消息"],
    ["success", "操作已成功完成"],
    ["warning", "请关注重要提示"],
    ["danger", "系统遇到了问题"],
  ];
  element.replaceChildren(
    ...variants.map(([type, content]) =>
      createMessageElement({ content, type }, element.ownerDocument),
    ),
  );
};

/** Static inline pills (page content). */
export const Variants: Story = {
  name: "Static variants",
  render: () => html` <div class="blora-stack" ${ref(mountVariants)}></div> `,
};

/** Ant-style floating stack (top-center). */
export const LiveAPI: Story = {
  name: "API message()",
  render: () => html`
    <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
      <button
        type="button"
        class="blora-button"
        data-variant="primary"
        @click=${() => message.success("操作成功")}
      >
        message.success
      </button>
      <button
        type="button"
        class="blora-button"
        data-variant="outline"
        @click=${() => message.info("这是一条提示")}
      >
        message.info
      </button>
      <button
        type="button"
        class="blora-button"
        data-variant="outline"
        @click=${() => message.warning("请注意")}
      >
        message.warning
      </button>
      <button
        type="button"
        class="blora-button"
        data-variant="outline"
        @click=${() => message.error("出错了")}
      >
        message.error
      </button>
    </div>
  `,
};
