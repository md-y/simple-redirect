/**
 * Opens new window to the target url and awaits a message from the callback url.
 * The callback page must have this script enabled.
 * @param targetUrl The OAUTH target url to an outside server.
 * @param callbackUrl The callback url the client will be redirected to.
 * @param timeout (Optional) The timeout in milliseconds for the server is closed. If -1, there will be no timeout
 * @returns The full callback url including response OAUTH parameters.
 */
const redirect = (
    targetUrl: string | URL,
    callbackUri: string,
    timeout = 2 * 60 * 1000,
): Promise<URL> => {
    return new Promise((resolve, reject) => {
        window.open(targetUrl, '_blank');

        const timeoutTimer = timeout > 0 ? setTimeout(() => {
            reject(`OAuth Login Sequence timed out after ${timeout}ms.`);
        }, timeout) : undefined;

        const channel = new BroadcastChannel('simple_oauth_callback');
        const callbackUrl = new URL(callbackUri);
        channel.addEventListener('message', async (ev: MessageEvent<string>) => {
            const url = new URL(ev.data);
            if (url.pathname === callbackUrl.pathname) {
                clearTimeout(timeoutTimer);
                resolve(url);
            }
        });
    });
}

export default redirect;

const locationUrl = new URL(window.location.href);
if (['code', 'token', 'id_token', 'redirect'].some((param) => locationUrl.searchParams.has(param))) {
    const channel = new BroadcastChannel('simple_oauth_callback');
    channel.postMessage(window.location.href);
    window.close();
}
