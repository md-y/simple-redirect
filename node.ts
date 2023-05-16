import http from 'node:http';
import open from 'open';

/**
 * Opens a web browser and navigates to the target url and awaits a request to the localhost callback url.
 * @param targetUrl The OAUTH target url to an outside server.
 * @param callbackUrl The localhost callback url the client will be redirected to.
 * @param timeout (Optional) The timeout in milliseconds for the server is closed. If -1, there will be no timeout
 * @param pageHTML (Optional) The HTML code of the callback page.
 * @returns The full callback url including response OAUTH parameters.
 */
export const redirect = (
    targetUrl: string | URL,
    callbackUri: string,
    timeout = 2 * 60 * 1000,
    pageHTML?: string
): Promise<URL> => {
    return new Promise((resolve, reject) => {
        if (typeof targetUrl === 'string') targetUrl = new URL(targetUrl);
        const callbackUrl = new URL(callbackUri, 'http://localhost');

        // Create server object reference (server wont open until later)
        const server = http.createServer();

        // Setup timeout
        const timeoutTimer =
            timeout > 0
                ? setTimeout(() => {
                      cleanupAndFinish(false, `Redirect server timed out after ${timeout}ms.`);
                  }, timeout)
                : undefined;

        // Function that will stop the server and clear the timeout
        const cleanupAndFinish = (resolved: boolean, body?: any) => {
            clearTimeout(timeoutTimer);
            server.close(() => {
                if (resolved) resolve(body);
                else reject(body);
            });
        };

        // Listen for the callback request and resolve once it is received
        server.on('request', async (req, res) => {
            if (req.url) {
                res.writeHead(200);
                res.end(
                    pageHTML ??
                        `<html><head><title>Simple OAUTH Redirect</title></head><body><h1>Success! (You can close this window)</h1><script>window.close();</script></body></html>`
                );
                const url = new URL(req.url, `http://${req.headers.host ?? callbackUrl.host}`);
                cleanupAndFinish(true, url);
            } else {
                res.writeHead(404);
                res.end();
            }
        });
        server.on('error', (err) => cleanupAndFinish(false, err));
        server.listen({
            host: callbackUrl.hostname,
            port: !callbackUrl.port ? '80' : callbackUrl.port,
        });

        // Open the web browser
        open(targetUrl.href);
    });
};
