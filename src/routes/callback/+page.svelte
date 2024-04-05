<script>
    export let data;
</script>

{#if data.error}
    <h1>Login to Spotify failed due to:</h1>
    <h2>{data.error}</h2>
    <a href="/">Go back to homepage</a>
{/if}