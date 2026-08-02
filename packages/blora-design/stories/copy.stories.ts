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
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

export const Default: Story = {
  render: () => html`
    <span
      class="blora-copy blora-typo-copy"
      data-blora-copy="npm i @bloret-crew/blora-design"
      ${ref(init)}
    >
      <code class="blora-code">npm i @bloret-crew/blora-design</code>
      <button class="blora-copy__btn blora-typo-copy__btn" type="button" aria-label="复制">
        ${unsafeHTML(copyIcon)}
      </button>
    </span>
  `,
};
