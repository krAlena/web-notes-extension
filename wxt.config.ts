import { defineConfig } from "wxt";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  modules: ["@wxt-dev/module-react"],

  webExt: {
    startUrls: ["https://google.com"],
  },

  manifest: {
    manifest_version: 3,
    name: "Web notes",
    description: "Quickly write, paste, or dictate notes directly in the browser.",
    key: process.env.VITE_EXTENSION_KEY,
    version: "1.0.4",
    version_name: "1.0.4",
    permissions: [
      "tabs",
      "activeTab",
      "storage",
      "contextMenus",
      "scripting"
    ],
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      128: "icon/128.png",
    },

    web_accessible_resources: [
      {
        resources: [
          "icon/*.png",
          "illustration/*.png",
          "utils/typed.umd.js",
          "font/*.ttf",
        ],
        matches: ["<all_urls>"],
      },
    ],
  },
});
