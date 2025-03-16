import { onMessage } from "webext-bridge/background";
import { browser } from "wxt/browser";
// import { CONFIG } from "../.config";
let responseCache = null;

export default defineBackground(() => {
    onMessage ("startGoogleAuthFlow", async ({ data, sender }) => {

        let token = null;
        try {
            // Call an async function to authenticate with Google
            const resp = await authenticateWithGoogle();

            console.log('Received message in background:', data, sender);
            console.log('Google authentication response:', resp);
            let resultUrl = new URL(resp);
            const params = new URLSearchParams(resultUrl?.hash.replace('#', ''));
            token = params.get("access_token");
            responseCache = { success: true, receivedData: token };
            console.log('params: ', params)
            // callback({ success: true, receivedData: token })
            return responseCache;
        } catch (error) {
            console.error('Authentication failed:', error);
            return { success: false, receivedData: token };
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
    const redirectUri = `https://${import.meta.env.VITE_EXTENSION_ID}.chromiumapp.org`
    // const scopes = "https://www.googleapis.com/auth/userinfo.profile";
    const scopes = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/keep";

    // "https://www.googleapis.com/auth/keep";

    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${encodeURIComponent(clientId)}&redirect_uri=${redirectUri}&response_type=token&scope=${encodeURIComponent(scopes)}`;


    try {
        // Initiating OAuth flow
        const result = await browser.identity.launchWebAuthFlow({
          url: authUrl,
          interactive: true
        });

        // Parsing the result
        console.log('Authentication result:', result);

        // Do something with the result (e.g., extracting token or user info)
        return result;
    }
    catch (error) {
        console.error('Error during Google authentication:', error);
        throw error; // Propagate the error to be handled by the caller
    }
}