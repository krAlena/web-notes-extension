import { onMessage } from "webext-bridge/background";
import { browser } from "wxt/browser";

export default defineBackground(() => {
    onMessage("startGoogleAuthFlow", ({ data, sender }) => {
        console.log('Received message in background:', data, sender);
        authenticateWithGoogle();

        // Optional: send a response back
        // return loadUserPreferences(sync);
        // return { success: true, receivedData: data };
    });

});

function authenticateWithGoogle() {
    const clientId = process.env.GOOGLE_AUTH_CLIENT_ID;
    const redirectUri = `https://${EXTENSION_ID}.chromiumapp.org`
    const scopes = "https://www.googleapis.com/auth/userinfo.profile";
    // "https://www.googleapis.com/auth/keep";

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scopes)}`;

    browser.identity.launchWebAuthFlow(
      {
        url: authUrl,
        interactive: true,
       }
    );
}