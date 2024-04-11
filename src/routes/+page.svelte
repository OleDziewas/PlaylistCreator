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


<Header authToken={data?.authToken}></Header>
<PlaylistInput authToken={data?.authToken}></PlaylistInput>
<div class="container w-full mx-auto flex flex-row justify-center items-center">
    <form hidden={(!form || form.error)} method="POST" action="?/playlistToSpotify" use:enhance={() => {form = undefined}}>
        <input name="playlist" hidden value={form}>
        <button class="mt-6 text-xl bg-green-600 hover:bg-green-300 text-white font-bold py-2 px-4 rounded-3xl shadow" on:click={setTransferTrue} type="submit">Transfer Playlist to Spotify</button>
    </form>
</div>
<Playlist playlist={form}></Playlist>

{#if $successfullTransfer}
    <div class="container mx-auto">
        <h3 class="block text-green-500 text-xl font-bold ml-12 my-5">The playlist was transfered to Spotify</h3>
    </div>
{/if}
{#if form?.error}
    <div class="container mx-auto">
        <h3 class="block text-red-500 text-xl font-bold ml-12 my-5">{form.error}</h3>
    </div>
{/if}


