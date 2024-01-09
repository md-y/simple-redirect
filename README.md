# Simple OAuth Redirect

A simple package for navigating to an OAuth endpoint, receiving the callback, and returning the callback URL all in one async function.

Supports both Node and browsers, both ESM and CommonJS, and TypeScript.

[![Version](https://img.shields.io/npm/v/simple-oauth-redirect.svg?style=flat)](https://www.npmjs.com/package/simple-oauth-redirect)

```bash
npm i simple-oauth-redirect
```

---

### How to use in Node

Import the Node implementation with `simple-oauth-redirect/node`. The function will create a simple http server that binds to the callback URL for the duration of the promise.

```javascript
const SimpleOAuth = require('simple-oauth-redirect/node');
// import { redirect } from "simple-oauth-redirect/node";

const callbackUrl = 'http://localhost:8000/callback';
const targetUrl = `http://example.com/oauth?redirect_uri=${encodeURIComponent(callbackUrl)}`;

SimpleOAuth.redirect(targetUrl, callbackUrl).then((url) => {
    console.log('OAuth callback url with codes:', url);
});
```

---

### How to use in browser

Import the browser implementation with `simple-oauth-redirect/web`. The browser implementation also uses the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API).

_The callback page must call `checkForCallback()` for the redirect promise to return._

<br>

**Example Svelte Implementation**

_index.svelte_

```svelte
<script lang="ts">
  import { redirect } from 'simple-oauth-redirect/web';

  let responseUrl: string;

  async function authButton() {
    const callbackUrl = `${window.location.origin}/callback`;
    const targetUrl = `http://example.com/oauth?redirect_uri=${encodeURIComponent(callbackUrl)}`;
    const res = await redirect(targetUrl, callbackUrl);
    responseUrl = res.href;
  }
</script>

{#if !responseUrl}
  <button on:click={() => authButton()}>Authorize</button>
{:else}
  <h1>Received URL:</h1>
  <p>{responseUrl}</p>
{/if}
```

_callback.svelte_

```svelte
<script>
  import { onMount } from 'svelte';
  import { checkForCallback } from 'simple-oauth-redirect/web';

  onMount(() => {
    checkForCallback();
  });
</script>
```

<br>
<br>

**Example Vanilla HTML Implementation**

_index.html_

```html
<html lang="en">
    <script type="module">
        import { redirect } from 'https://cdn.skypack.dev/simple-oauth-redirect/web';
        document.getElementById('auth-button').addEventListener('click', () => {
            const callbackUrl = `${window.location.origin}/callback.html`;
            const targetUrl = `http://example.com/oauth?redirect_uri=${encodeURIComponent(callbackUrl)}`;

            redirect(targetUrl, callbackUrl).then((url) => {
                alert('OAuth callback url with codes: ' + url);
                console.log('OAuth callback url with codes:', url);
            });
        });
    </script>
    <body>
        <button id="auth-button">Authorize</button>
    </body>
</html>
```

_callback.html_

```html
<html lang="en">
    <script type="module">
        import { checkForCallback } from 'https://cdn.skypack.dev/simple-oauth-redirect/web';
        checkForCallback();
    </script>
</html>
```
