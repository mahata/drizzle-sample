import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    env: {
      NODE_ENV: "test",
    },
    // TODO: Enable browser mode once Playwright browsers can be installed
    // browser: {
    //   enabled: true,
    //   name: 'chromium',
    //   provider: 'playwright',
    // },
  },
});
