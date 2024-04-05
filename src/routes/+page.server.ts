import { CLIENT_ID } from '$env/static/private';
import { setState } from '$lib/sharedState.js';
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

export const actions = {
	default: async ({ request }) => {
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
	}
};