<script lang="ts">
    import Header from './Header.svelte';
    import Playlist from './Playlist.svelte';
    import PlaylistInput from './PlaylistInput.svelte';
    export let data;
    export let form;
</script>

{#if !data?.authToken}
    <form method="POST" action="?/login">
        <button type="submit">Login to Spotify</button>
    </form>
{:else}
    <Header authToken={data?.authToken}></Header>
    <PlaylistInput></PlaylistInput>
    <Playlist playlist={form}></Playlist>
    <form hidden={!form} method="POST" action="?/playlistToSpotify">
        <input name="playlist" hidden value={form}>
        <button type="submit">Transfer Playlist to Spotify</button>
    </form>
{/if}

