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

const getRandomSongs = async function(authToken: string | undefined){
    // API request mit Parametern machen und Liste erstellen
    let q = "B";
    let limit = 50;
    let offset = 0;
    const res = await fetch(`https://api.spotify.com/v1/search?q=${q}&type=track&market=DE&limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${authToken}`
        },
    });
    const search = await res.json();
    return search;
}

const filterItems = function(items: any, filter: FormData){
    //TODO: Filter items
    let playlistLength = filter.get("playlistLength");
    return items.slice(0, playlistLength);
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
        let len = params.get("playlistLength");
        let title = params.get("playlistName");
        // Get random songs
        const search = await getRandomSongs(authToken);
        let items = search.tracks.items;

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
    }
};