import { defineConfig } from "wxt";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  runner: {
    startUrls: ["https://google.com"],
  },
  manifest: {
    manifest_version: 3,
    name: "Web notes",
    description: "Quickly write, paste, or dictate notes directly in the browser.",
    key: process.env.VITE_EXTENSION_KEY,
    version: "1.0",
    version_name: "1.0.1-alpha1",
    permissions: ["tabs", "activeTab", "storage", "identity", "contextMenus"],
    oauth2: {
      client_id: process.env.VITE_GOOGLE_AUTH_CLIENT_ID,
      scopes: [
        "openId",
        "profile",
        "https://www.googleapis.com/auth/keep"
        // "https://www.googleapis.com/auth/userinfo.email"
      ]
    },
    background: {
      service_worker: "background.js"
    },
    icons: {
      16: "icon/16.png",
      32: "icon/32.png",
      48: "icon/48.png",
      128: "icon/128.png"
    },
    content_scripts: [
      {
        matches: ["<all_urls>"],
        exclude_matches: [
          "*://extensions/*",
          "*://newtab/*",
        ],
        js: ["content-scripts/content.js"]
        // css: ["content-scripts/content.css"]
      }
    ],
    web_accessible_resources: [
      {
        "resources": [
          "icon/*.png",
          "illustration/*.png",
          "utils/typed.umd.js"
        ],
        "matches": ["<all_urls>"]
      }
    ]
  }
});