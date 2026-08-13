import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";
import { defineBloraSwap } from "../src/components/swap";
defineBloraSwap();
const meta = { title: "Actions/Swap", component: "blora-swap", tags: ["autodocs"] } satisfies Meta;
export default meta;
type Story = StoryObj;
export const States: Story = { render: () => html\`<div class="blora-row"><blora-swap off-label="深色模式" on-label="浅色模式"></blora-swap><blora-swap checked off-label="深色模式" on-label="浅色模式"></blora-swap></div>\` };
