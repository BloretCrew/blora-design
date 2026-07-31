import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { ref } from "lit/directives/ref.js";
import { createCopyController } from "../src/components/copy";

const meta = {
  title: "Utils/Copy",
  component: ".blora-copy",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  (el as any).__ctrl?.destroy();
  (el as any).__ctrl = createCopyController(el);
};

const copyIcon =
  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

export const Default: Story = {
  render: () => html`
    <div
      class="blora-copy"
      data-copy-text="npm install @bloret-crew/blora-design"
      ${ref(init)}
      style="display: inline-flex; align-items: center; gap: var(--blora-space-2); padding: 0.5em 0.8em; background: var(--blora-color-surface-sunken); border-radius: var(--blora-radius-md); font-family: var(--blora-font-mono); font-size: var(--blora-text-sm);"
    >
      <code>npm install @bloret-crew/blora-design</code>
      <button
        class="blora-copy__btn"
        type="button"
        aria-label="复制"
        style="display: inline-flex; align-items: center; border: none; background: none; cursor: pointer; color: var(--blora-color-text-subtle); padding: 0.2em; border-radius: var(--blora-radius-sm);"
      >
        ${unsafeHTML(copyIcon)}
      </button>
    </div>
  `,
};
