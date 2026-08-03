import type { StorybookConfig } from "@storybook/web-components-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|ts)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-a11y", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/web-components-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  /* Bind for LAN / arbitrary Host header access (pair with storybook -h 0.0.0.0) */
  async viteFinal(config) {
    config.server = {
      ...config.server,
      host: true,
      // Vite 5+: allow any Host (IP, tunnel, custom DNS)
      allowedHosts: true,
    };
    return config;
  },
};

export default config;
