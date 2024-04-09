import { CLIENT_ID } from '$env/static/private';
import { getPlaylist, setPlaylist, setState } from '$lib/sharedState.js';
import { redirect } from '@sveltejs/kit';

export function load({cookies}){
    const authToken = cookies.get("authToken");
    return {
        'authToken' : authToken
    }
}

const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const getRandomSongs = async function(authToken: string | undefined, popularity: FormDataEntryValue | null){
    // API request mit Parametern machen und Liste erstellen
    let possible = 'abcdefghijklmnopqrstuvwxyz';
    let possible_songs: any[] = [];
    let q = "A";
    let list_of_qs: string[] = [];
    let limit = 25;
    let searchRounds = 10;
    let offset = 0;
    //Value between 1 and 100
    for (let i = 0; i < searchRounds; i++){
        if (i === searchRounds-1){
            possible = '123456789';
        }
        q = possible[Math.floor(Math.random()*possible.length)];
        while (list_of_qs.includes(q)){
            q = possible[Math.floor(Math.random()*possible.length)];
        }
        list_of_qs.push(q);
        offset = Math.floor(Math.random()*(800/Number(popularity))) + (100-Number(popularity));
        console.log(q);
        const res = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&market=DE&limit=${limit}&offset=${offset}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`
            },
        });
        const search = await res.json();
        possible_songs = possible_songs.concat(search.tracks.items);
    }
    
    return possible_songs;
}

const filterItems = function(items: any, filter: FormData){
    //TODO: Filter items
    let playlistLength = filter.get("playlistLength");
    let limit = 25;
    let res = [];
    let list_of_indeces: number[] = [];
    for (let i = 0; i < Number(playlistLength); i++){
        let index = Math.floor(((i*limit)+(Math.random()*limit))%250);
        while (list_of_indeces.includes(index)){
            index = Math.floor(((i*limit)+(Math.random()*limit))%250);
        }
        list_of_indeces.push(index);
        console.log(index);
        res.push(items[index]);
    }
    return res;
}

export const actions = {
	login: async ({ request }) => {
		await request.formData();
        // Make Spotify Call
		const client_id = CLIENT_ID;
        const redirect_uri = 'http://localhost:5173/callback';
        const state = generateRandomString(16);
        setState(state);
        const scope = 'playlist-read-private playlist-modify-private playlist-modify-public';
        const authUrl = new URL("https://accounts.spotify.com/authorize")
        const params = {
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }
        authUrl.search = new URLSearchParams(params).toString();
        redirect(303, authUrl.toString());
	},

    createPlaylist: async ({ request, cookies }) => {
        const authToken = cookies.get("authToken");
        let params = await request.formData();
        let len = Number(params.get("playlistLength"));
        let title = params.get("playlistName");
        let popularity = params.get("popularity");

        if (title === "" || title === undefined){
            return { "error": "Empty Title is not allowed."}
        }

        if (len <= 0 || len > 50) {
            return { "error": "Number of songs has to be between 1 and 50."}
        } 
        // Get random songs
        let items = await getRandomSongs(authToken, popularity);
        // Filter the songs with given attributes
        items = filterItems(items, params);

        // Prep Song
        let songs = []

        // Get Songnames
        for (let i = 0; i < items.length; i++){
            let artist_names = []
            for (let e = 0; e < items[i].artists.length; e++){
                artist_names.push(items[i].artists[e].name);
            }
            songs[i] = {
                "songName": items[i].name,
                "artists": artist_names,
                "cover" : items[i].album.images[1].url,
                "duration" : items[i].duration_ms,
                "id" : items[i].id
            };
        }

        let playlist = {
            "title" : title,
            "len" : len,
            "songs": songs
        }
        //Songs: Titel (tracks.items.name), Artist (tracks.items.artists[].name), Cover, Dauer, ID
        setPlaylist(playlist);
        return playlist;

    },

    playlistToSpotify: async ({cookies}) => {
        let authToken = cookies.get("authToken");
        let playlist = getPlaylist();
        const res = await fetch("https://api.spotify.com/v1/me", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${authToken}`
            },
        });
        const profile = await res.json();
        let user_id = profile.id;
        console.log(playlist.title);
        // Create Playlist
        const playlist_res = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name: playlist.title,
            })
        });
        const playlist_json = await playlist_res.json();
        const playlist_id = playlist_json.id;

        
        // Add Songs to playlist
        const songs = playlist.songs;
        let songIDs = []
        for (let i = 0; i < songs.length; i++){
            songIDs.push("spotify:track:"+songs[i].id);
        }
        
        const addSongsRes = await fetch(`https://api.spotify.com/v1/playlists/${playlist_id}/tracks`, {
            method: "POST",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${authToken}`
            },
            body: JSON.stringify({
                uris: songIDs
            })
        });
    }
};