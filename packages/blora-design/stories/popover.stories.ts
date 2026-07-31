import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Navigation/Popover",
  component: ".blora-popover",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="padding: 3rem; text-align: center;">
      <span
        class="blora-popover"
        @click=${(e: Event) => {
          const pop = (e.target as HTMLElement).closest(".blora-popover");
          pop?.toggleAttribute("data-open");
        }}
      >
        <button class="blora-button" type="button" data-variant="outline">点击触发</button>
        <div class="blora-popover__panel">
          <p style="margin: 0;">这是一个弹出内容区域。</p>
        </div>
      </span>
    </div>
  `,
};
