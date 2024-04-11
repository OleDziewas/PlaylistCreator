<script lang="ts">
	import { onMount } from "svelte";
    export let authToken: string | undefined;
    let username = "";
    onMount(async () => {
        if (authToken) {
            const res = await fetch("https://api.spotify.com/v1/me", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${authToken}`
                },
            });
            const profile = await res.json();
            username = profile.display_name;
        }
	});
</script>


<div class="w-screen m-auto flex md:flex-row flex-col justify-between items-center bg-gradient-to-r from-emerald-600 to-sky-400 px-12">
    <h1 class="text-5xl text-white font-bold m-5 drop-shadow-[0_5.0px_5.0px_rgba(0,0,0,1)]">PlaylistCreator</h1>
    {#if !authToken}
        <form method="POST" action="?/login">
            <button class="m-6 border-4 border-gray-700 bg-white text-gray-700 hover:bg-emerald-600 font-bold py-2 px-4 rounded-full text-xl" type="submit">Login to Spotify</button>
        </form>
    {:else}
        <h1 class="p-8 font-semibold text-lg">{username}</h1>
    {/if}
</div>