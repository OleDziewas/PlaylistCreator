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

<h1>{username}</h1>