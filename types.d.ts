declare module 'simple-oauth-redirect/web' {
    /**
     * Opens new window to the target url and awaits a message from the callback url.
     * The callback page must run {@link checkForCallback} for this promise to return.
     * @param targetUrl The OAUTH target url to an outside server.
     * @param callbackUrl The callback url the client will be redirected to.
     * @param timeout (Optional) The timeout in milliseconds for the server is closed. If -1, there will be no timeout
     * @returns The full callback url including response OAUTH parameters.
     */
    const redirect: (targetUrl: string | URL, callbackUri: string, timeout?: number) => Promise<URL>;
    /**
     * Checks if this page is an OAUTH callback, and if it is, it will broadcast a message back to the redirect page and close this page.
     */
    const checkForCallback: () => void;
}

declare module 'simple-oauth-redirect/node' {
    /**
     * Opens a web browser and navigates to the target url and awaits a request to the localhost callback url.
     * @param targetUrl The OAUTH target url to an outside server.
     * @param callbackUrl The localhost callback url the client will be redirected to.
     * @param timeout (Optional) The timeout in milliseconds for the server is closed. If -1, there will be no timeout
     * @param pageHTML (Optional) The HTML code of the callback page.
     * @returns The full callback url including response OAUTH parameters.
     */
    const redirect: (targetUrl: string | URL, callbackUri: string, timeout?: number, pageHTML?: string) => Promise<URL>;
}

