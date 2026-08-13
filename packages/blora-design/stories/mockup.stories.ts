import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Mockup/Mockup",
  component: "blora-mockup",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Browser: Story = {
  render: () => html`
    <blora-mockup variant="browser" address="https://blora.design/components">
      <div>
        <strong>Blora Design</strong>
        <p class="blora-text-muted">令牌驱动的 Web UI 框架</p>
      </div>
    </blora-mockup>
  `,
};

export const Code: Story = {
  render: () => html`
    <blora-mockup variant="code" label="终端输出">
      <blora-mockup-line prefix="$">
        <code>npm install @bloret-crew/blora-design</code>
      </blora-mockup-line>
      <blora-mockup-line prefix="✓" tone="success">
        <code>project ready</code>
      </blora-mockup-line>
    </blora-mockup>
  `,
};

export const Window: Story = {
  render: () => html`
    <blora-mockup variant="window" title="Preferences">
      <p>深色模式 · 跟随系统</p>
    </blora-mockup>
  `,
};

export const Phone: Story = {
  render: () => html`
    <div style="display:grid;justify-items:center">
      <blora-mockup variant="phone" label="手机预览">
        <strong>Good morning, Blora</strong>
      </blora-mockup>
    </div>
  `,
};
