import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITrack } from '../interfaces/track.interface';
import { IArtist } from '../interfaces/artist.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tracksUrl = 'assets/data/spotify_tracks_with_featuring.csv';
  private artistsUrl = 'assets/data/spotify_artist_info.csv';

  constructor(private http: HttpClient) {}

  // Cargar tracks desde el archivo CSV
  getTracks(): Observable<ITrack[]> {
    return this.http.get(this.tracksUrl, { responseType: 'text' }).pipe(
      map(csv => this.parseTracks(csv))
    );
  }

  // Cargar artistas desde el archivo CSV
  getArtists(): Observable<IArtist[]> {
    return this.http.get(this.artistsUrl, { responseType: 'text' }).pipe(
      map(csv => this.parseArtists(csv))
    );
  }

  // Parser para los datos de los tracks
  private parseTracks(csv: string): ITrack[] {
    const rows = csv.split('\n');
    const headers = rows.shift()?.split(',').map(header => header.trim()) || [];

    return rows
      .filter(row => row.trim().length > 0) // Ignorar filas vacías
      .map(row => {
        const values = this.splitCSVRow(row);
        const track: any = {};
        headers.forEach((header, index) => {
          track[header] = values[index];
        });

        // Mapear y convertir campos específicos
        return {
          track_id: track.track_id,
          track_name: track.track_name,
          artist_name: track.artist_name ? track.artist_name.split(',').map((name: string) => name.trim()) : [],
          year: parseInt(track.year, 10) || 0,
          popularity: parseInt(track.popularity, 10) || 0,
          artwork_url: track.artwork_url,
          album_name: track.album_name,
          acousticness: parseFloat(track.acousticness) || 0,
          danceability: parseFloat(track.danceability) || 0,
          duration_ms: parseFloat(track.duration_ms) || 0,
          energy: parseFloat(track.energy) || 0,
          instrumentalness: parseFloat(track.instrumentalness) || 0,
          key: parseInt(track.key, 10) || 0,
          liveness: parseFloat(track.liveness) || 0,
          loudness: parseFloat(track.loudness) || 0,
          mode: parseInt(track.mode, 10) || 0,
          speechiness: parseFloat(track.speechiness) || 0,
          tempo: parseFloat(track.tempo) || 0,
          time_signature: parseInt(track.time_signature, 10) || 0,
          valence: parseFloat(track.valence) || 0,
          track_url: track.track_url,
          language: track.language,
          featuring: parseInt(track.featuring, 10) === 1,
          genres: track.genres ? track.genres.split(';').map((genre: string) => genre.trim()) : []
        } as ITrack;
      });
  }

  // Parser para los datos de los artistas
  private parseArtists(csv: string): IArtist[] {
    const rows = csv.split('\n');
    const headers = rows.shift()?.split(',').map(header => header.trim()) || [];

    return rows
      .filter(row => row.trim().length > 0) // Ignorar filas vacías
      .map(row => {
        const values = this.splitCSVRow(row);
        const artist: any = {};
        headers.forEach((header, index) => {
          artist[header] = values[index];
        });

        return {
          artist_name: artist.artist_name,
          spotify_id: artist.spotify_id,
          genres: artist.genres ? artist.genres.split(';').map((genre: string) => genre.trim()) : [],
          popularity: parseInt(artist.popularity, 10) || 0,
          followers: parseInt(artist.followers, 10) || 0
        } as IArtist;
      });
  }

  // Utilidad para dividir filas CSV con comillas
  private splitCSVRow(row: string): string[] {
    const regex = /(?:,|\n|^)(?:"([^"]*(?:""[^"]*)*)"|([^",\n]*))/g;
    const result: string[] = [];
    let match;
    while ((match = regex.exec(row)) !== null) {
      result.push(match[1] ? match[1].replace(/""/g, '"') : match[2]);
    }
    return result;
  }
}
