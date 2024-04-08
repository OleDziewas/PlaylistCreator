<script lang="ts">
    import { creating, successfullTransfer } from "$lib/stores";
    import { enhance } from '$app/forms';
    let playlistName = "playlist"
    let playlistLength = 1;

    function setTransferFalse(){
        successfullTransfer.set(false);
    }
</script>

<form method="POST" action="?/createPlaylist" use:enhance={() => {
    creating.set(true);
    return async ({ update }) => {
        await update();
        creating.set(false);
    };
}}>
    <label>Playlist Name: <input name="playlistName" bind:value={playlistName} type="text"></label><br>
    <label>Number of Songs: <input name="playlistLength" bind:value={playlistLength} type="number" min=1 max =50></label><br>
    <button on:click={setTransferFalse} type="submit">Create Playlist</button>
</form>
