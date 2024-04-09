<script lang="ts">
    import { creating, successfullTransfer } from "$lib/stores";
    import { enhance } from '$app/forms';
    import { browser } from "$app/environment";
	import { afterUpdate } from "svelte";
    let playlistName = "Playlist"
    let playlistLength = 1;
    let popularity = 100;

    function setTransferFalse(){
        successfullTransfer.set(false);
    }

</script>

<form id="playlistAttributes" method="POST" action="?/createPlaylist" use:enhance={() => {
    creating.set(true);
    return async ({ update }) => {
        await update( {reset : false});
        creating.set(false);
    };
}}>
    <label>Playlist Name: <input name="playlistName" bind:value={playlistName} type="text"></label><br>
    <label>Number of Songs: <input name="playlistLength" bind:value={playlistLength} type="number" min=1 max=50></label><br>
    <label>Popularity: <input name="popularity" type="range"bind:value={popularity} min=1 max=100> {popularity}</label><br>
    <button on:click={setTransferFalse} type="submit">Create Playlist</button>
</form>
