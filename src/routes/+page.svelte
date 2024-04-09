<script lang="ts">
	import { enhance } from '$app/forms';
	import { successfullTransfer } from '$lib/stores';
    import Header from './Header.svelte';
    import Playlist from './Playlist.svelte';
    import PlaylistInput from './PlaylistInput.svelte';
    export let data;
    export let form : any;
    function setTransferTrue(){
        successfullTransfer.set(true);
    }

</script>

{#if !data?.authToken}
    <div class="mx-auto h-screen flex flex-column items-center bg-gradient-to-r from-emerald-600 to-sky-400">
        <div class="container mx-auto flex flex-col h-2/5 w-2/3 md:justify-center justify-start items-center rounded-3xl shadow-2xl bg-white">
            <h1 class="text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-400 m-12 mb-0 md:mb-12 text-center">
                Playlist Creator <object class="inline" aria-label="playlist" data="playlist_add_symbol.svg" type="image/svg+xml"></object>
            </h1>
            <form method="POST" action="?/login">
                <button class="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-full text-xl" type="submit">Login to Spotify</button>
            </form>
        </div>
    </div>
{:else}
    <Header authToken={data?.authToken}></Header>
    <PlaylistInput></PlaylistInput>
    <Playlist playlist={form}></Playlist>
    <form hidden={(!form || form.error)} method="POST" action="?/playlistToSpotify" use:enhance>
        <input name="playlist" hidden value={form}>
        <button on:click={setTransferTrue} type="submit">Transfer Playlist to Spotify</button>
    </form>
    {#if $successfullTransfer}
        <h3 style="color:green">The playlist was transfered to Spotify</h3>
    {/if}
    {#if form?.error}
        <h3 style="color:red">{form.error}</h3>
    {/if}
    
{/if}

