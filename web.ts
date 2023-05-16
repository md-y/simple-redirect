type BroadcastMessage = {
    type: 'callback' | 'processed';
    url: string;
};

const CHANNEL = 'simple_oauth_callback';

/**
 * Opens new browser window to the target url and awaits a message from the callback url.
 * If running in the browser, the callback page must run {@link checkForCallback} for this promise to return.
 * @param targetUrl The OAUTH target url to an outside server.
 * @param callbackUrl The callback url the client will be redirected to.
 * @param timeout (Optional) The timeout in milliseconds for the server is closed. If -1, there will be no timeout
 * @returns The full callback url including response OAUTH parameters.
 */
export const redirect = (targetUrl: string | URL, callbackUri: string, timeout = 2 * 60 * 1000): Promise<URL> => {
    return new Promise((resolve, reject) => {
        window.open(targetUrl, '_blank');

        const timeoutTimer =
            timeout > 0
                ? setTimeout(() => {
                      reject(`OAuth Login Sequence timed out after ${timeout}ms.`);
                  }, timeout)
                : undefined;

        const channel = new BroadcastChannel(CHANNEL);
        const callbackUrl = new URL(callbackUri);
        channel.addEventListener('message', async (ev: MessageEvent<BroadcastMessage>) => {
            if (ev.data.type === 'callback') {
                const url = new URL(ev.data.url);
                if (url.pathname === callbackUrl.pathname) {
                    clearTimeout(timeoutTimer);
                    channel.postMessage({
                        type: 'processed',
                        url: url.href,
                    } as BroadcastMessage);
                    resolve(url);
                }
            }
        });
    });
};

/**
 * Checks if this page is an OAUTH callback, and if it is, it will broadcast a message back to the redirect page and close this page.
 */
export const checkForCallback = (): void => {
    const locationUrl = new URL(window.location.href);
    if (['code', 'token', 'id_token', 'redirect'].some((param) => locationUrl.searchParams.has(param))) {
        const channel = new BroadcastChannel(CHANNEL);
        const url = window.location.href;
        channel.addEventListener('message', async (ev: MessageEvent<BroadcastMessage>) => {
            if (ev.data.type === 'processed' && ev.data.url === url) window.close();
        });
        channel.postMessage({ type: 'callback', url: url } as BroadcastMessage);
    }
};
