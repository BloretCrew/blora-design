import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { ref } from "lit/directives/ref.js";
import { renderMarkdownTo } from "../../../addons/markdown/src/index";
import "../../../addons/markdown/src/markdown.css";

const meta = {
  title: "Add-ons/Markdown",
  component: ".blora-md",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const src = `## 标题
这是一段 **粗体** 与 *斜体*，以及 \`行内代码\`。

- 列表项一
- 列表项二

> 引用块

\`\`\`
const x = 1;
\`\`\`
`;

const init = (el: Element | undefined): void => {
  if (!(el instanceof HTMLElement)) return;
  renderMarkdownTo(el, src, { sanitize: true, allowHtml: false });
};

export const Default: Story = {
  render: () => html` <div class="blora-md" ${ref(init)} style="max-width: 36rem;"></div> `,
};
