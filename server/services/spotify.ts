import { SpotifyApi } from "@spotify/web-api-ts-sdk";

let connectionSettings: any;

async function getAccessToken() {
  if (connectionSettings && connectionSettings.settings.expires_at && new Date(connectionSettings.settings.expires_at).getTime() > Date.now()) {
    return connectionSettings.settings.access_token;
  }
  
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('Spotify connection token not found');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=spotify',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  const refreshToken = connectionSettings?.settings?.oauth?.credentials?.refresh_token;
  const accessToken = connectionSettings?.settings?.access_token || connectionSettings.settings?.oauth?.credentials?.access_token;
  const clientId = connectionSettings?.settings?.oauth?.credentials?.client_id;
  const expiresIn = connectionSettings.settings?.oauth?.credentials?.expires_in;

  if (!connectionSettings || (!accessToken || !clientId || !refreshToken)) {
    throw new Error('Spotify not connected');
  }

  return { accessToken, clientId, refreshToken, expiresIn };
}

export async function getSpotifyClient() {
  const { accessToken, clientId, refreshToken, expiresIn } = await getAccessToken();

  const spotify = SpotifyApi.withAccessToken(clientId, {
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: expiresIn || 3600,
    refresh_token: refreshToken,
  });

  return spotify;
}

export async function getCurrentUser() {
  const spotify = await getSpotifyClient();
  return await spotify.currentUser.profile();
}

export async function getUserPlaylists(limit: number = 20) {
  const spotify = await getSpotifyClient();
  return await spotify.currentUser.playlists.playlists(limit as 20);
}

export async function getPlaylistTracks(playlistId: string) {
  const spotify = await getSpotifyClient();
  return await spotify.playlists.getPlaylistItems(playlistId);
}

export async function getCurrentlyPlaying() {
  const spotify = await getSpotifyClient();
  return await spotify.player.getCurrentlyPlayingTrack();
}

export async function getRecentlyPlayed(limit: number = 20) {
  const spotify = await getSpotifyClient();
  return await spotify.player.getRecentlyPlayedTracks(limit as 20);
}

export async function getTopTracks(limit: number = 20) {
  const spotify = await getSpotifyClient();
  return await spotify.currentUser.topItems("tracks", undefined, limit as 20);
}

export async function getTopArtists(limit: number = 20) {
  const spotify = await getSpotifyClient();
  return await spotify.currentUser.topItems("artists", undefined, limit as 20);
}

export async function searchTracks(query: string, limit: number = 10) {
  const spotify = await getSpotifyClient();
  return await spotify.search(query, ["track"], undefined, limit as 10);
}

export async function getUserLibrary(limit: number = 20) {
  const spotify = await getSpotifyClient();
  return await spotify.currentUser.tracks.savedTracks(limit as 20);
}
