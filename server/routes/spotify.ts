import { Router } from "express";
import {
  getCurrentUser,
  getUserPlaylists,
  getPlaylistTracks,
  getCurrentlyPlaying,
  getRecentlyPlayed,
  getTopTracks,
  getTopArtists,
  searchTracks,
  getUserLibrary,
} from "../services/spotify";

const router = Router();

router.get("/me", async (req, res) => {
  try {
    const profile = await getCurrentUser();
    res.json({
      success: true,
      profile: {
        id: profile.id,
        displayName: profile.display_name,
        email: profile.email,
        country: profile.country,
        followers: profile.followers?.total,
        images: profile.images,
        product: profile.product,
        uri: profile.uri,
      },
    });
  } catch (error: any) {
    console.error("Spotify profile error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get Spotify profile" 
    });
  }
});

router.get("/playlists", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const playlists = await getUserPlaylists(limit);
    res.json({
      success: true,
      playlists: playlists.items.map((p) => ({
        id: p.id,
        name: p.name,
        description: p.description,
        images: p.images,
        tracksTotal: p.tracks?.total,
        owner: p.owner?.display_name,
        isPublic: p.public,
        uri: p.uri,
      })),
      total: playlists.total,
    });
  } catch (error: any) {
    console.error("Spotify playlists error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get playlists" 
    });
  }
});

router.get("/playlists/:playlistId/tracks", async (req, res) => {
  try {
    const { playlistId } = req.params;
    const tracks = await getPlaylistTracks(playlistId);
    res.json({
      success: true,
      tracks: tracks.items.map((item) => ({
        id: item.track?.id,
        name: item.track?.name,
        artists: item.track?.artists?.map((a) => a.name).join(", "),
        album: item.track?.album?.name,
        albumImage: item.track?.album?.images?.[0]?.url,
        duration: item.track?.duration_ms,
        addedAt: item.added_at,
        uri: item.track?.uri,
      })),
      total: tracks.total,
    });
  } catch (error: any) {
    console.error("Spotify playlist tracks error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get playlist tracks" 
    });
  }
});

router.get("/now-playing", async (req, res) => {
  try {
    const current = await getCurrentlyPlaying();
    if (!current || !current.item) {
      return res.json({ 
        success: true, 
        isPlaying: false, 
        track: null 
      });
    }
    
    const track = current.item as any;
    res.json({
      success: true,
      isPlaying: current.is_playing,
      track: {
        id: track.id,
        name: track.name,
        artists: track.artists?.map((a: any) => a.name).join(", "),
        album: track.album?.name,
        albumImage: track.album?.images?.[0]?.url,
        duration: track.duration_ms,
        progress: current.progress_ms,
        uri: track.uri,
      },
    });
  } catch (error: any) {
    console.error("Spotify now playing error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get currently playing" 
    });
  }
});

router.get("/recently-played", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const recent = await getRecentlyPlayed(limit);
    res.json({
      success: true,
      tracks: recent.items.map((item) => ({
        id: item.track?.id,
        name: item.track?.name,
        artists: item.track?.artists?.map((a) => a.name).join(", "),
        album: item.track?.album?.name,
        albumImage: item.track?.album?.images?.[0]?.url,
        playedAt: item.played_at,
        uri: item.track?.uri,
      })),
    });
  } catch (error: any) {
    console.error("Spotify recently played error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get recently played" 
    });
  }
});

router.get("/top/tracks", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const topTracks = await getTopTracks(limit);
    res.json({
      success: true,
      tracks: topTracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists?.map((a) => a.name).join(", "),
        album: track.album?.name,
        albumImage: track.album?.images?.[0]?.url,
        popularity: track.popularity,
        uri: track.uri,
      })),
    });
  } catch (error: any) {
    console.error("Spotify top tracks error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get top tracks" 
    });
  }
});

router.get("/top/artists", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const topArtists = await getTopArtists(limit);
    res.json({
      success: true,
      artists: topArtists.items.map((artist) => ({
        id: artist.id,
        name: artist.name,
        genres: artist.genres,
        images: artist.images,
        popularity: artist.popularity,
        followers: artist.followers?.total,
        uri: artist.uri,
      })),
    });
  } catch (error: any) {
    console.error("Spotify top artists error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get top artists" 
    });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q as string;
    const limit = parseInt(req.query.limit as string) || 10;
    
    if (!query) {
      return res.status(400).json({ 
        success: false, 
        error: "Search query required" 
      });
    }
    
    const results = await searchTracks(query, limit);
    res.json({
      success: true,
      tracks: results.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artists: track.artists?.map((a) => a.name).join(", "),
        album: track.album?.name,
        albumImage: track.album?.images?.[0]?.url,
        duration: track.duration_ms,
        popularity: track.popularity,
        uri: track.uri,
      })),
    });
  } catch (error: any) {
    console.error("Spotify search error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to search tracks" 
    });
  }
});

router.get("/library", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const library = await getUserLibrary(limit);
    res.json({
      success: true,
      tracks: library.items.map((item) => ({
        id: item.track?.id,
        name: item.track?.name,
        artists: item.track?.artists?.map((a) => a.name).join(", "),
        album: item.track?.album?.name,
        albumImage: item.track?.album?.images?.[0]?.url,
        addedAt: item.added_at,
        uri: item.track?.uri,
      })),
      total: library.total,
    });
  } catch (error: any) {
    console.error("Spotify library error:", error.message);
    res.status(500).json({ 
      success: false, 
      error: error.message || "Failed to get library" 
    });
  }
});

export default router;
