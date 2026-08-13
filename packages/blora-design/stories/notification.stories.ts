import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import {
  createNotificationController,
  createNotificationElement,
  type NotificationOptions,
} from "../src/components/notification";

const meta = {
  title: "Feedback/Notification",
  component: ".blora-notification",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const mountVariants = (element: Element | undefined): void => {
  if (!(element instanceof HTMLElement)) return;
  const variants: NotificationOptions[] = [
    { type: "success", title: "保存成功", description: "文档已保存至云端。" },
    { type: "warning", title: "存储空间不足", description: "剩余空间不足 1GB，请及时清理。" },
    { type: "danger", title: "删除失败", description: "该项目存在关联数据，不可删除。" },
    { type: "info", title: "系统通知", description: "scheduled maintenance" },
  ];
  const cards = variants.map((options) =>
    createNotificationElement(options, element.ownerDocument),
  );
  element.replaceChildren(...cards);
  cards.forEach((card) => createNotificationController(card));
};

export const Variants: Story = {
  render: () => html`
    <div class="blora-stack" style="max-width: 24rem;" ${ref(mountVariants)}></div>
  `,
};
