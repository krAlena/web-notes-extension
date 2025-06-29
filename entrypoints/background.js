import { onMessage } from "webext-bridge/background";
import { browser } from "wxt/browser";
// import { CONFIG } from "../.config";
let responseCache = null;


browser.runtime.onInstalled.addListener(async ({ reason }) => {
    browser.contextMenus.create({
        id: "toNote",
        title: "Add to note",
        contexts: ["selection"]
    });

    browser.contextMenus.onClicked.addListener((info, tab) => {
        console.log('try to send msg from context bckg to CS:', info);
        if (info.menuItemId == "toNote") {
            browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
                browser.tabs.sendMessage(tabs[0].id, { action: "copyToNote", info });
            });
        }
    });


    if (reason !== "install") return;


    // Open a tab on install
    await browser.tabs.create({
        url: browser.runtime.getURL("/welcome.html"),
        active: true,
    });
});

async function fetchUserProfile(accessToken) {
    try {
      const response = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      const user = await response.json();
      console.log("UserProfileData:", user);

      await browser.storage.local.set({ user });
    //   await browser.tabs.create({
    //     url: browser.runtime.getURL("/welcome.html"),
    //     active: true,
    //   });
    } catch (error) {
      console.error(error);
    }
}
export default defineBackground(() => {
    onMessage ("startGoogleAuthFlow", async ({ data, sender }) => {

        let accessToken = null;
        try {
            // Call an async function to authenticate with Google
            const resp = await authenticateWithGoogle();

            console.log('Received message in background:', data, sender);
            console.log('Google authentication response:', resp);
            let resultUrl = new URL(resp);
            const params = new URLSearchParams(resultUrl?.hash.replace('#', ''));
            const accessToken = params.get("access_token");

            if (accessToken) {
                fetchUserProfile(accessToken);
                //   fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
                //     headers: { Authorization: `Bearer ${accessToken}` }
                //   })
                //   .then(response => response.json())
                //   .then(user => {
                //     console.log("UserProfileData:", user);
                //     await browser.storage.local.set({ user });
                //     await browser.tabs.create({
                //         url: browser.runtime.getURL("/welcome.html"),
                //         active: true,
                //     });
                //   })
                //   .catch(console.error);
            }
            responseCache = { success: true, receivedData: accessToken };
            console.log('params: ', params)
            // callback({ success: true, receivedData: token })
            return responseCache;
        } catch (error) {
            console.error('Authentication failed:', error);
            return { success: false, receivedData: accessToken };
        }
        // Optional: send a response back
        // return loadUserPreferences(sync);
        // return { success: true, receivedData: data };
    });

    // Handle reconnection requests
    onMessage('fetch-response-cache', async () => {
        return responseCache;
    });
});

async function authenticateWithGoogle() {
    const clientId = import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID;
    const redirectUri = `https://${import.meta.env.VITE_EXTENSION_ID}.chromiumapp.org`;
    const scopes = "https://www.googleapis.com/auth/userinfo.profile";
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scopes)}`;

    try {
        // Initiating OAuth flow
        const result = await browser.identity.launchWebAuthFlow({
          url: authUrl,
          interactive: true
        });

        // Parsing the result
        console.log('Authentication result:', result);
        // chrome.tabs.create({ url: chrome.runtime.getURL("entrypoints/newtab/welcomeUser.html") });
        // Do something with the result (e.g., extracting token or user info)
        await browser.tabs.create({
            url: browser.runtime.getURL("/welcome.html"),
            active: true,
        });
        return result;
    }
    catch (error) {
        console.error('Error during Google authentication:', error);
        throw error; // Propagate the error to be handled by the caller
    }
}