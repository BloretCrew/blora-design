import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
const meta = { title: "Data display/Media Container", component: ".blora-media", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;
export const Ratios: Story = { render: () => html\`<div class="blora-grid blora-grid--3"><div class="blora-media" data-ratio="square"><span>1 : 1</span></div><div class="blora-media"><span>16 : 9</span></div><div class="blora-media" data-ratio="portrait"><span>3 : 4</span></div></div>\` };
