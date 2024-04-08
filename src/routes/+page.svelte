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
    <form method="POST" action="?/login">
        <button type="submit">Login to Spotify</button>
    </form>
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

