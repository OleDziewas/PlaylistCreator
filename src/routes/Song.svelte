<script lang="ts">
    export let song: any;
    function turnToMin(ms: number){
        const date = new Date(ms);
        return `${date.getMinutes()}:${('0' + date.getSeconds()).slice(-2)}`;
    }
</script>

<div class="container">
    <div class="songinfo">
        <p><b>Name: {song.songName}</b></p>
        <p>Artists: {song.artists}</p>
        <p>Duration: {turnToMin(song.duration)}</p>
        <p>ID: {song.id}</p>
    </div>
    <img width="80" height="80" alt='{song.songName} Cover' src={song.cover}>
</div>

<style>
    .container{
        border: 2px solid black;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .songinfo {
        display: flex;
        gap: 0px;
        flex-direction: column;
    }
    p {
        font-size: 1em;
        padding: 0;
        margin: 0;
    }
</style>