import { nodePolyfills } from "vite-plugin-node-polyfills";
import { defineConfig } from "wxt";
// See https://wxt.dev/api/config.html
export default defineConfig({
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["storage"],
  },
  // @ts-ignore
  vite: () => ({
    plugins: [nodePolyfills()],
  }),
});
