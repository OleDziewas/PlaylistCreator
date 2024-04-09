<script lang="ts">
    import { creating, successfullTransfer } from "$lib/stores";
    import { enhance } from '$app/forms';
    import { browser } from "$app/environment";
	import { afterUpdate } from "svelte";
    let playlistName = "Playlist"
    let playlistLength = 10;
    let popularity = 100;
    const genres = [ 'Pop', 'Singer-Songwriter', 'Rap', 'Electronic', 'Blues', 'Jazz', 'Soul',  'Rock', 'Metal', 'Punk', 'Country',  'Folk'];
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
    <div class="genre-container">
        <h3>Genre</h3>
        {#each genres as genre}
            <label>{genre}<input type="checkbox" name={genre}></label><br>
        {/each}
    </div>
    <button on:click={setTransferFalse} type="submit">Create Playlist</button>
</form>