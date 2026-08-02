import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/List",
  component: ".blora-list",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

const listItems = html`
  <div class="blora-list__item">
    <div class="blora-avatar" data-size="sm">A</div>
    <div class="blora-list__meta">
      <div class="blora-list__title">Alice</div>
      <div class="blora-list__desc">管理员</div>
    </div>
  </div>
  <div class="blora-list__item">
    <div class="blora-avatar" data-size="sm" data-variant="success">B</div>
    <div class="blora-list__meta">
      <div class="blora-list__title">Bob</div>
      <div class="blora-list__desc">编辑者</div>
    </div>
  </div>
  <div class="blora-list__item">
    <div class="blora-avatar" data-size="sm" data-variant="info">C</div>
    <div class="blora-list__meta">
      <div class="blora-list__title">Carol</div>
      <div class="blora-list__desc">访客</div>
    </div>
  </div>
`;

/** Bare list (row dividers only — no outer chrome). */
export const Default: Story = {
  render: () => html` <div class="blora-list" style="max-width: 24rem;">${listItems}</div> `,
};

/**
 * Temporary demo: List composed inside Card for outer border / radius.
 * List itself stays borderless; shell comes from Card.
 */
export const InCard: Story = {
  name: "In Card (composed border)",
  render: () => html`
    <div class="blora-card" style="max-width: 24rem; padding: 0; overflow: hidden;">
      <div class="blora-list">${listItems}</div>
    </div>
  `,
};
