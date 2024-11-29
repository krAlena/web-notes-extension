import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  runner: {
    startUrls: ["https://google.com"],
  },
  manifest: {
    manifest_version: 3,
    name: "Web notes",
    version: "1.0",
    version_name: "1.0.1-alpha1",
    permissions: ["tabs", "activeTab"],
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      128: "icon/128.png"
    },
  }
});