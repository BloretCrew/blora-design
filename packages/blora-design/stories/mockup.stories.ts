import type { Meta, StoryObj } from "@storybook/web-components";
import { html } from "lit";

const meta = {
  title: "Layout/Mockup",
  component: ".blora-mockup",
  tags: ["autodocs"],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const Default: Story = {
  render: () => html`
    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--blora-space-5);">
      <!-- Browser -->
      <div class="blora-mockup blora-mockup--browser">
        <div class="blora-mockup__toolbar">
          <span class="blora-mockup__dots" aria-hidden="true"><span></span></span>
          <div class="blora-mockup__address">https://blora.design/components</div>
        </div>
        <div class="blora-mockup__body blora-mockup__body--center">
          <div>
            <strong>Blora Design</strong>
            <p class="blora-text-muted" style="margin: 0.35em 0 0;">令牌驱动的 Web UI 框架</p>
          </div>
        </div>
      </div>

      <!-- Code -->
      <div class="blora-mockup blora-mockup--code" role="region" aria-label="终端输出示例">
        <pre class="blora-mockup__line" data-prefix="$"><code>npm install @bloret-crew/blora-design</code></pre>
        <pre class="blora-mockup__line blora-mockup__line--muted" data-prefix=">"><code>installing packages…</code></pre>
        <pre class="blora-mockup__line blora-mockup__line--success" data-prefix="✓"><code>added 12 packages in 1.2s</code></pre>
        <pre class="blora-mockup__line" data-prefix="$"><code>npx blora init</code></pre>
        <pre class="blora-mockup__line blora-mockup__line--info" data-prefix="✓"><code>project ready</code></pre>
      </div>

      <!-- Window -->
      <div class="blora-mockup blora-mockup--window">
        <div class="blora-mockup__toolbar">
          <span class="blora-mockup__dots" aria-hidden="true"><span></span></span>
          <span class="blora-mockup__title">Preferences</span>
        </div>
        <div class="blora-mockup__body">
          <div style="display: grid; gap: var(--blora-space-3); font-size: var(--blora-text-sm);">
            <label style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
              <span>深色模式</span><span class="blora-text-muted">跟随系统</span>
            </label>
            <label style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
              <span>主色</span><span class="blora-text-muted">Coral</span>
            </label>
            <label style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
              <span>动效</span><span class="blora-text-muted">标准</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Phone -->
      <div class="blora-mockup blora-mockup--phone" aria-label="手机预览">
        <div class="blora-mockup__camera" aria-hidden="true"></div>
        <div class="blora-mockup__display">
          <div class="blora-mockup__display-body" style="display: flex; flex-direction: column; gap: var(--blora-space-3);">
            <div>
              <div class="blora-text-xs blora-text-muted">Good morning</div>
              <div style="font-size: var(--blora-text-lg); font-weight: 600;">Blora</div>
            </div>
            <div style="padding: var(--blora-space-3); border-radius: var(--blora-radius-sm); background: var(--blora-color-surface-raised); border: 1px solid var(--blora-color-border-subtle);">
              <div style="font-weight: 600; font-size: var(--blora-text-sm);">今日任务</div>
              <div class="blora-text-muted" style="font-size: var(--blora-text-xs);">3 项待处理</div>
            </div>
            <button class="blora-button" data-variant="primary" data-size="sm" type="button" style="width: 100%; margin-top: auto;">继续</button>
          </div>
        </div>
      </div>
    </div>
  `,
};
