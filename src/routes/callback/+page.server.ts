import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';
import { getState } from '$lib/sharedState.js';
import { redirect, type Cookies } from '@sveltejs/kit';

const getAuthToken = async function(code: string, cookies: Cookies) {
    const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + (new (Buffer as any).from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: 'http://localhost:5173/callback'
        }),
      }
    
    const body = await fetch('https://accounts.spotify.com/api/token', payload);
    const response =await body.json();
    return response;
}

export async function load({cookies, url})  {
    // Get URL Params
    const params = new URLSearchParams(url.searchParams);
    const keys = Array.from(params.keys());
    const values = Array.from(params.values());
    const state = getState();
    
    // Return if /callback was opened without authentication process
    if (keys.length === 0){
        return {'error' : 'No authentication process started.'}
    }
    // Return error if authentication failed
    if (keys.find((k) => k === 'error')){
        return {'error' : values[0]}
    }

    if (state !== values[1]){
        return {'error' : 'Wrong state of authentication request.'}
    }
    
    // Set cookie and redirect if authentication was successfull
    const code = values[0];
    const response = await getAuthToken(code, cookies);
    cookies.set('authToken', response.access_token, {
        path: '/',
        maxAge: response.expires_in,
        httpOnly: true,
	    secure: true,
	    sameSite: 'lax'
    });
    redirect(303, "/");
}