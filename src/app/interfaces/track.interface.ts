export interface ITrack {
  track_id: string;
  track_name: string;
  artist_name: string[];
  album_name: string;
  popularity: number;
  duration_ms: number;
  explicit: boolean;
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  time_signature: number;
  track_genre: string;
  artist_popularity?: number;
}
