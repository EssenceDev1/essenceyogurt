import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainNav from "@/components/layout/main-nav";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Play, Pause, SkipForward, Volume2, Sparkles, Clock, ListMusic, Radio, Smartphone, QrCode } from "lucide-react";
import spotifyCodeImage from "@assets/IMG_1215_1764755469069.png";

const ESSENCE_PLAYLISTS = [
  {
    id: "morning-zen",
    name: "Morning Zen",
    description: "Calm, uplifting vibes to start the day",
    timing: "6:00 AM - 11:00 AM",
    mood: "Peaceful",
    genres: ["Acoustic", "Chill", "Jazz"],
    color: "from-amber-100 to-yellow-200",
    tracks: 45
  },
  {
    id: "afternoon-lounge",
    name: "Afternoon Lounge",
    description: "Smooth, sophisticated background music",
    timing: "11:00 AM - 4:00 PM",
    mood: "Elegant",
    genres: ["Lounge", "Bossa Nova", "Soft Pop"],
    color: "from-rose-100 to-pink-200",
    tracks: 62
  },
  {
    id: "essence-party",
    name: "Essence Party",
    description: "Upbeat energy for peak hours",
    timing: "4:00 PM - 9:00 PM",
    mood: "Energetic",
    genres: ["Pop", "Dance", "Feel Good"],
    color: "from-amber-200 to-yellow-400",
    tracks: 78
  },
  {
    id: "evening-bliss",
    name: "Evening Bliss",
    description: "Relaxed tunes for wind-down hours",
    timing: "9:00 PM - Close",
    mood: "Relaxing",
    genres: ["R&B", "Soul", "Chill"],
    color: "from-amber-100 to-neutral-200",
    tracks: 54
  },
  {
    id: "weekend-vibes",
    name: "Weekend Vibes",
    description: "Fun, family-friendly energy",
    timing: "Weekends All Day",
    mood: "Playful",
    genres: ["Pop Hits", "Upbeat", "Party"],
    color: "from-green-100 to-teal-200",
    tracks: 85
  },
  {
    id: "luxury-selection",
    name: "Luxury Selection",
    description: "Premium curated classics",
    timing: "VIP Events",
    mood: "Sophisticated",
    genres: ["Classical", "Jazz", "Instrumental"],
    color: "from-amber-300 to-yellow-500",
    tracks: 40
  }
];

const NOW_PLAYING = {
  track: "Golden Hour",
  artist: "JVKE",
  album: "This Is What Heartbreak Feels Like",
  duration: "3:29",
  progress: 65,
  playlist: "Essence Party"
};

export default function EssenceMusic() {
  const [activePlaylist, setActivePlaylist] = useState("essence-party");
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(70);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-amber-50/30">
      <MainNav />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">In-Store Ambiance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-gray-900 mb-4">
            Essence <span className="bg-gradient-to-r from-amber-500 to-yellow-500 bg-clip-text text-transparent">Music</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated playlists designed for the perfect luxury yogurt experience
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-12">
          <Card className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 text-white overflow-hidden shadow-xl" data-testid="now-playing-card">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Music className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <p className="text-white/80 text-sm mb-1 flex items-center justify-center md:justify-start gap-2">
                    <Radio className="w-4 h-4" />
                    Now Playing • {NOW_PLAYING.playlist}
                  </p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-1" data-testid="text-now-playing-track">{NOW_PLAYING.track}</h2>
                  <p className="text-white/90 text-lg">{NOW_PLAYING.artist}</p>
                  <p className="text-white/70 text-sm">{NOW_PLAYING.album}</p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-white/70">1:52</span>
                    <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white rounded-full transition-all duration-300"
                        style={{ width: `${NOW_PLAYING.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-white/70">{NOW_PLAYING.duration}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    onClick={() => setIsPlaying(!isPlaying)}
                    data-testid="button-play-pause"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white"
                    data-testid="button-skip"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(parseInt(e.target.value))}
                      className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                      data-testid="input-volume"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="playlists" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-amber-50 p-1 rounded-xl">
            <TabsTrigger value="playlists" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg" data-testid="tab-playlists">
              <ListMusic className="w-4 h-4 mr-2" />
              Curated Playlists
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg" data-testid="tab-schedule">
              <Clock className="w-4 h-4 mr-2" />
              Auto Schedule
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playlists">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ESSENCE_PLAYLISTS.map((playlist) => (
                <Card 
                  key={playlist.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    activePlaylist === playlist.id ? 'ring-2 ring-amber-500 ring-offset-2' : ''
                  }`}
                  onClick={() => setActivePlaylist(playlist.id)}
                  data-testid={`card-playlist-${playlist.id}`}
                >
                  <div className={`h-32 bg-gradient-to-br ${playlist.color} flex items-center justify-center`}>
                    <Music className="w-12 h-12 text-white/80" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{playlist.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{playlist.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {playlist.genres.map((genre) => (
                        <span 
                          key={genre}
                          className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {playlist.timing}
                      </span>
                      <span>{playlist.tracks} tracks</span>
                    </div>
                    {activePlaylist === playlist.id && (
                      <Button 
                        className="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white"
                        data-testid={`button-play-${playlist.id}`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Automatic Playlist Scheduling
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6">
                  Playlists automatically switch based on time of day for the perfect ambiance
                </p>
                <div className="space-y-4">
                  {ESSENCE_PLAYLISTS.slice(0, 4).map((playlist, index) => (
                    <div 
                      key={playlist.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      data-testid={`schedule-${playlist.id}`}
                    >
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${playlist.color} flex items-center justify-center`}>
                        <Music className="w-6 h-6 text-white/80" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{playlist.name}</h4>
                        <p className="text-sm text-gray-500">{playlist.timing}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          index === 2 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {index === 2 ? 'Active Now' : 'Scheduled'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Spotify Code Section */}
        <div className="max-w-4xl mx-auto mt-16" data-testid="spotify-code-section">
          <Card className="overflow-hidden shadow-2xl border-0">
            <div className="grid md:grid-cols-2">
              {/* Spotify Code Image */}
              <div className="bg-[#b5a165] flex items-center justify-center p-8">
                <img 
                  src={spotifyCodeImage} 
                  alt="Essence Yogurt Spotify Code - Scan to listen" 
                  className="w-full max-w-sm rounded-lg shadow-lg"
                  data-testid="img-spotify-code"
                />
              </div>
              
              {/* Scan Instructions */}
              <div className="p-8 flex flex-col justify-center bg-gradient-to-br from-white to-amber-50/50">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium w-fit mb-4">
                  <QrCode className="w-4 h-4" />
                  Spotify Code
                </div>
                <h3 className="text-3xl font-playfair font-bold text-gray-900 mb-3">
                  Listen at Home
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Love the music playing in our stores? Take the Essence Yogurt experience home with you! 
                  Scan this Spotify code with your phone to access our curated playlists.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-700 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Open Spotify App</p>
                      <p className="text-sm text-gray-500">Launch Spotify on your phone</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-700 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Tap Search, Then Camera</p>
                      <p className="text-sm text-gray-500">Find the camera icon in the search bar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-amber-700 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Scan the Code</p>
                      <p className="text-sm text-gray-500">Point your camera at the Spotify code</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Smartphone className="w-10 h-10 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Works on iOS & Android</p>
                    <p className="text-xs text-gray-500">Requires Spotify app (free or premium)</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8 border border-amber-100">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto mb-4" />
            <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
              Essence Party Experience
            </h3>
            <p className="text-gray-600 mb-6">
              Premium curated music designed exclusively for Essence Yogurt locations. 
              No ads, no interruptions - just perfect ambiance for your customers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-2xl font-bold text-amber-600">364</span>
                <span className="text-sm text-gray-500 ml-1">Total Tracks</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-2xl font-bold text-amber-600">6</span>
                <span className="text-sm text-gray-500 ml-1">Curated Playlists</span>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg shadow-sm">
                <span className="text-2xl font-bold text-amber-600">24/7</span>
                <span className="text-sm text-gray-500 ml-1">Auto Scheduling</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
