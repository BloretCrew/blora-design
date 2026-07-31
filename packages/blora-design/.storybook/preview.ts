import type { Preview } from "@storybook/web-components";
import { html } from "lit";

// Import Blora Design CSS - full stack from source
import "../../tokens/generated/tokens.css";
import "../src/foundations/reset.css";
import "../src/foundations/base.css";
import "../src/foundations/layout.css";
import "../src/foundations/utilities.css";

// Import all component CSS
import "../src/components/button/button.css";
import "../src/components/dialog/dialog.css";
import "../src/components/select/select.css";
import "../src/components/field/field.css";
import "../src/components/input/input.css";
import "../src/components/textarea/textarea.css";
import "../src/components/checkbox/checkbox.css";
import "../src/components/radio/radio.css";
import "../src/components/switch/switch.css";
import "../src/components/tag/tag.css";
import "../src/components/alert/alert.css";
import "../src/components/badge/badge.css";
import "../src/components/progress/progress.css";
import "../src/components/spinner/spinner.css";
import "../src/components/skeleton/skeleton.css";
import "../src/components/toast/toast.css";
import "../src/components/tabs/tabs.css";
import "../src/components/breadcrumb/breadcrumb.css";
import "../src/components/pagination/pagination.css";
import "../src/components/dropdown/dropdown.css";
import "../src/components/tooltip/tooltip.css";
import "../src/components/popover/popover.css";
import "../src/components/drawer/drawer.css";
import "../src/components/navbar/navbar.css";
import "../src/components/card/card.css";
import "../src/components/table/table.css";
import "../src/components/list/list.css";
import "../src/components/accordion/accordion.css";
import "../src/components/timeline/timeline.css";
import "../src/components/empty/empty.css";
import "../src/components/result/result.css";
import "../src/components/avatar/avatar.css";
import "../src/components/banner/banner.css";
import "../src/components/message/message.css";
import "../src/components/notification/notification.css";
import "../src/components/sidebar-layout/sidebar-layout.css";
import "../src/components/steps/steps.css";
import "../src/components/statistic/statistic.css";
import "../src/components/descriptions/descriptions.css";
import "../src/components/image/image.css";
import "../src/components/segmented/segmented.css";
import "../src/components/popconfirm/popconfirm.css";
import "../src/components/collapse/collapse.css";

import "../src/components/affix/affix.css";
import "../src/components/autocomplete/autocomplete.css";
import "../src/components/calendar/calendar.css";
import "../src/components/carousel/carousel.css";
import "../src/components/cascader/cascader.css";
import "../src/components/chart-container/chart-container.css";
import "../src/components/chat/chat.css";
import "../src/components/color-picker/color-picker.css";
import "../src/components/command-palette/command-palette.css";
import "../src/components/comment/comment.css";
import "../src/components/copy/copy.css";
import "../src/components/countdown/countdown.css";
import "../src/components/datepicker/datepicker.css";
import "../src/components/deck/deck.css";
import "../src/components/dock/dock.css";
import "../src/components/fab/fab.css";
import "../src/components/masonry/masonry.css";
import "../src/components/megamenu/megamenu.css";
import "../src/components/mentions/mentions.css";
import "../src/components/mockup/mockup.css";
import "../src/components/otp/otp.css";
import "../src/components/range/range.css";
import "../src/components/rate/rate.css";
import "../src/components/search/search.css";
import "../src/components/slider/slider.css";
import "../src/components/speed-dial/speed-dial.css";
import "../src/components/splitter/splitter.css";
import "../src/components/tags-input/tags-input.css";
import "../src/components/text-rotate/text-rotate.css";
import "../src/components/timepicker/timepicker.css";
import "../src/components/tour/tour.css";
import "../src/components/transfer/transfer.css";
import "../src/components/tree/tree.css";
import "../src/components/upload/upload.css";
import "../src/components/watermark/watermark.css";

const preview: Preview = {
  parameters: {
    backgrounds: {
      default: "light",
      values: [
        { name: "light", value: "#FAF7F8" },
        { name: "dark", value: "#1A1A1F" },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [
          // WCAG 2.2 AA baseline
          { id: "color-contrast", enabled: true },
        ],
      },
    },
  },
  // Wrap all stories in .blora-scope so foundations and components apply
  decorators: [(story) => html`<div class="blora-scope" style="padding: 1rem;">${story()}</div>`],
};

export default preview;
