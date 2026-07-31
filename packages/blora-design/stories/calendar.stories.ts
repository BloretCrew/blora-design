import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Data/Calendar",
  component: ".blora-calendar",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
// July 2026: starts on Wednesday (index 3)
const days = [
  { d: 29, other: true }, { d: 30, other: true },
  ...Array.from({ length: 31 }, (_, i) => ({ d: i + 1, other: false })),
  { d: 1, other: true }, { d: 2, other: true },
];

export const Default: Story = {
  render: () => html`
    <div class="blora-calendar" style="max-width: 480px;">
      <div class="blora-calendar__header">
        <button class="blora-calendar__nav" type="button" aria-label="上个月">‹</button>
        <span class="blora-calendar__title">2026年7月</span>
        <button class="blora-calendar__nav" type="button" aria-label="下个月">›</button>
      </div>
      <div class="blora-calendar__weekdays">
        ${weekdays.map((w) => html`<span class="blora-calendar__weekday">${w}</span>`)}
      </div>
      <div class="blora-calendar__grid">
        ${days.map((day) => html`
          <span class="blora-calendar__day${day.other ? " blora-calendar__day--other" : ""}${day.d === 31 && !day.other ? " blora-calendar__day--today" : ""}${day.d === 15 && !day.other ? " blora-calendar__day--selected" : ""}">${day.d}</span>
        `)}
      </div>
    </div>
  `,
};
