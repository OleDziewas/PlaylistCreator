let state: String;
let playlist: any;

export function setState(value: String) {
    state = value;
}

export function getState() {
    return state;
}

export function setPlaylist(value: any) {
    playlist = value;
}

export function getPlaylist() {
    return playlist;
}