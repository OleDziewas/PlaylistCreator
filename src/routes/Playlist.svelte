<script lang="ts">
	import { creating } from "$lib/stores";
    import Song from "./Song.svelte";
    export let playlist: any;
</script>

{#if ($creating)}
    <h1>Creating...</h1>
{:else}
    {#if playlist}
        {#if !playlist.error}
            <h2>{playlist.title}</h2>
            <p>Number of Songs: {playlist.len}</p>
            {#each playlist?.songs as song}
                <Song song={song}></Song>
            {/each}
        {/if}
    {/if}
{/if}


