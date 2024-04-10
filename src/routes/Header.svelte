<script lang="ts">
	import { onMount } from "svelte";
    export let authToken: string;
    let username = "";
    onMount(async () => {
		const res = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`
            },
        });
        const profile = await res.json();
        username = profile.display_name;
	});
</script>

<div class="container m-auto flex flex-row justify-end items-center bg-gradient-to-r from-emerald-600 to-sky-400 w-screen">
    <h1 class="p-8 font-semibold text-lg">{username}</h1>
</div>