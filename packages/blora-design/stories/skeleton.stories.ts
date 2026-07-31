import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Feedback/Skeleton",
  component: ".blora-skeleton",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const CardSkeleton: Story = {
  render: () => html`
    <div class="blora-card">
      <div class="blora-skeleton" style="width: 60%; height: 1.25rem;"></div>
      <div class="blora-skeleton" style="width: 100%; height: 0.875rem; margin-top: 0.5rem;"></div>
      <div class="blora-skeleton" style="width: 80%; height: 0.875rem; margin-top: 0.3rem;"></div>
      <div class="blora-skeleton" style="width: 50%; height: 0.875rem; margin-top: 0.3rem;"></div>
    </div>
  `,
};

export const AvatarSkeleton: Story = {
  render: () => html`
    <div class="blora-row">
      <div class="blora-skeleton" style="width: 2.5rem; height: 2.5rem; border-radius: 50%;"></div>
      <div class="blora-stack" style="gap: 0.3rem;">
        <div class="blora-skeleton" style="width: 8rem; height: 0.875rem;"></div>
        <div class="blora-skeleton" style="width: 5rem; height: 0.75rem;"></div>
      </div>
    </div>
  `,
};
