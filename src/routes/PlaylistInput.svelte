<script lang="ts">
    import { creating, successfullTransfer } from "$lib/stores";
    import { enhance } from '$app/forms';
    import { browser } from "$app/environment";
	import { afterUpdate } from "svelte";

    export let authToken: string | undefined;

    let playlistName = "Playlist"
    let playlistLength = 10;
    let popularity = 100;
    
    const genres = [ 'Pop', 'Singer-Songwriter', 'Rap', 'Electronic', 'Blues', 'Jazz', 'Soul',  'Rock', 'Metal', 'Punk', 'Country',  'Folk'];
    function setTransferFalse(){
        successfullTransfer.set(false);
    }

</script>

<div class="w-screem mx-auto">
    <form id="playlistAttributes" method="POST" action="?/createPlaylist" use:enhance={() => {
        creating.set(true);
        return async ({ update }) => {
            await update( {reset : false});
            creating.set(false);
        };
    }}>
        <div class="container flex md:flex-row flex-col justify-evenly items-center">
            <div class="md:w-1/3 w-full p-12">
                <div class="container flex md:flex-row flex-col justify-between items-center">
                    <label class="block text-gray-700 text-xl font-bold mb-2" for="playlistName">Playlist Name: </label>
                    <input class="text-center w-1/2 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="playlistName" name="playlistName" bind:value={playlistName} type="text">
                </div>
                <br>
                <div class="container flex md:flex-row flex-col justify-between items-center">
                    <label class="block text-gray-700 text-xl font-bold mb-2" for="playlistLength">Number of Songs: </label>
                    <input class="text-center w-1/2 shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline [&::-webkit-inner-spin-button]:appearance-none [appearance:textfield]" id="playlistLength" name="playlistLength" bind:value={playlistLength} type="number" min=1 max=50>
                </div>
                <br>
                <div class="container flex md:flex-row flex-col justify-between items-center">
                    <label class="block text-gray-700 text-xl font-bold mb-2" for="popularity">Popularity:</label>
                    <input class="w-1/2" id="popularity" name="popularity" type="range"bind:value={popularity} min=1 max=100>
                </div>
                <br>
            </div>
            <div class="md:w-1/2 w-full bg-blue-400">
                <h3>Genre</h3>
                {#each genres as genre}
                    <label>{genre}<input type="checkbox" name={genre}></label><br>
                {/each}
            </div>
        </div>
        {#if authToken}
            <div class="container md:w-1/3 w-full flex flex-row items-center justify-center">
                <button class="m-6 text-xl bg-green-600 hover:bg-gray-100 text-white font-bold py-2 px-4  rounded-3xl shadow" on:click={setTransferFalse} type="submit">Create Playlist</button>
            </div>
        {:else}
            <div class="container md:w-1/3 w-full flex flex-row items-center justify-center">
                <form method="POST" action="?/login">
                    <button class="m-6 text-xl bg-green-600 hover:bg-gray-100 text-white font-bold py-2 px-4  rounded-3xl shadow" type="submit">Create Playlist</button>
                </form>
            </div>
        {/if}
    </form>
</div>