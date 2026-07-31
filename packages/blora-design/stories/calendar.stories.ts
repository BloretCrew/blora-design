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
const days = [
  [29, 30, 1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17, 18, 19],
  [20, 21, 22, 23, 24, 25, 26],
  [27, 28, 29, 30, 31, 1, 2],
];

export const Default: Story = {
  render: () => html`
    <div class="blora-calendar" style="max-width: 320px;">
      <div class="blora-calendar__title">2026 年 7 月</div>
      <div class="blora-calendar__grid">
        ${weekdays.map((d) => html`<div class="blora-calendar__dow">${d}</div>`)}
        ${days.map((week) =>
          week.map((d, i) => {
            const isOther = (d > 15 && i < 3) || (d < 10 && i > 4);
            const isToday = d === 31 && !isOther;
            const isSelected = d === 15 && !isOther;
            return html`<div
              class="blora-calendar__cell"
              data-other=${isOther ? "" : undefined}
              data-today=${isToday ? "" : undefined}
              data-selected=${isSelected ? "" : undefined}
            >
              ${d}
            </div>`;
          }),
        )}
      </div>
    </div>
  `,
};
