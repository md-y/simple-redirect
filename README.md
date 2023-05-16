# Simple OAuth Redirect

A simple package for navigating to an OAuth endpoint, receiving the callback, and returning the callback URL all in one async function.

Supports both Node and browsers, both ESM and CommonJS, and TypeScript.

```bash
npm i simple-oauth-redirect 
```

---

### How to use in Node

Import the Node implementation with ```simple-oauth-redirect/node```. The function will create a simple http server that binds to the callback URL for the duration of the promise.

```javascript
const SimpleOAuth = require('simple-oauth-redirect/node');
// import { redirect } from "simple-oauth-redirect/node";

const targetUrl = 'http://example.com/oauth';
const callbackUrl = 'http://localhost:8000/callback';

SimpleOAuth.redirect(targetUrl, callbackUrl).then((url) => {
    console.log('OAuth callback url with codes:', url);
});
```

---

### How to use in browser
Import the browser implementation with ```simple-oauth-redirect/web```. The browser implementation also uses the [Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API).


*The callback page must call ```checkForCallback()``` for the redirect promise to return.*

<br>

**Example Svelte Implementation**

*index.svelte*
```svelte
<script lang="ts">
	import { redirect } from 'simple-oauth-redirect/web';

	let responseUrl: string;

	async function authButton() {
		const targetUrl = 'http://example.com/oauth';
		const callbackUrl = `${window.location.origin}/callback`;
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

*callback.svelte*
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

*index.html*
```html
<html lang="en">
<script type="module">
    import { redirect } from "https://www.unpkg.com/simple-oauth-redirect@latest/dist/esm/web.js";
    document.getElementById('auth-button').addEventListener('click', () => {
        const targetUrl = 'http://example.com/oauth';
        const callbackUrl = `${window.location.origin}/callback.html`;

        redirect(targetUrl, callbackUrl).then((url) => {
            console.log('OAuth callback url with codes:', url);
        });
    });
</script>
<body>
    <button id="auth-button">Authorize</button>
</body>
</html>
```
*callback.html*
```html
<html lang="en">
<script type="module">
    import { checkForCallback } from "https://www.unpkg.com/simple-oauth-redirect@latest/dist/esm/web.js";
    checkForCallback();
</script>
</html>
```
