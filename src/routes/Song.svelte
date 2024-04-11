<script lang="ts">
    export let song: any;

    function turnToMin(ms: number){
        const date = new Date(ms);
        return `${date.getMinutes()}:${('0' + date.getSeconds()).slice(-2)}`;
    }
</script>

<div class="border-4 border px-12 mb-4 rounded-3xl container flex flex-row items-center justify-between w-3/4 mx-auto">
    <div class="py-2">
        <p class="text-gray-700 text-xl font-bold mb-2">{song.songName}</p>
        <p>Artists: {song.artists.join(', ')}</p>
        <p>Duration: {turnToMin(song.duration)}</p>
    </div>
    <img width="80" height="80" alt='{song.songName} Cover' src={song.cover}>
</div>