<script>
    export let data;
</script>

{#if data?.authToken}
    <h1>Welcome to SvelteKit <b>{ data?.authToken}</b></h1>
    <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
{:else}
    <form method="POST">
        <button type="submit">Login to Spotify</button>
    </form>
{/if}

