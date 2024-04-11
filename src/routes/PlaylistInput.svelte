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
            <div class="grid grid-cols-2 md:grid-cols-4 md:gap-4 md:w-1/2 w-5/">
                <h3 class="block text-gray-700 text-xl font-bold mb-2 col-span-2 md:col-span-4">Genre:</h3>
                {#each genres as genre}
                    <div class="col-span-1 m-2 flex flex-row justify-start items-center">
                        <input class="before:content[''] peer relative h-8 w-8 cursor-pointer appearance-none rounded-full border border-gray-900/20 bg-gray-900/10 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-green-500 checked:before:bg-gray-900 hover:scale-105 hover:before:opacity-0" id={genre} type="checkbox" name={genre}>
                        <span
                            class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                                stroke="currentColor" stroke-width="1">
                                <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd"></path>
                            </svg>
                        </span>
                        <label class="pl-5" for={genre}>{genre}</label>
                    </div>
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
                    <button class="m-6 text-xl bg-green-600 hover:bg-green-300 text-white font-bold py-2 px-4  rounded-3xl shadow" type="submit">Create Playlist</button>
                </form>
            </div>
        {/if}
    </form>
</div>