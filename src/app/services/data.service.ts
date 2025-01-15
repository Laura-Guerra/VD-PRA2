import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ITrack } from '../interfaces/track.interface';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private tracksUrl = 'assets/data/tracks_final.csv';
  private tracksSubject = new BehaviorSubject<ITrack[]>([]);
  private tracks$: Observable<ITrack[]>;

  constructor(private http: HttpClient) {
    this.tracks$ = this.http.get(this.tracksUrl, { responseType: 'text' }).pipe(
      map((csv) => this.parseTracks(csv)),
      tap((tracks) => this.tracksSubject.next(tracks)) // Emmagatzema els tracks processats
    );
  }

  getTracks(): Observable<ITrack[]> {
    return this.tracks$;
  }

  getTracksSync(): ITrack[] {
    return this.tracksSubject.getValue();
  }

  private parseTracks(csv: string): ITrack[] {
    const rows = csv.split('\n');
    const headers =
      rows
        .shift()
        ?.split(',')
        .map((header) => header.trim()) || [];

    return rows
      .filter((row) => row.trim().length > 0)
      .map((row) => {
        const values = this.splitCSVRow(row);
        const track: any = {};
        headers.forEach((header, index) => {
          track[header] = values[index];
        });

        return {
          track_id: track.track_id,
          track_name: track.track_name,
          artist_name: track.artists
            ? track.artists.split(';').map((name: string) => name.trim())
            : [],
          album_name: track.album_name,
          popularity: parseInt(track.popularity, 10) || 0,
          duration_ms: parseInt(track.duration_ms, 10) || 0,
          explicit: track.explicit === 'True',
          danceability: parseFloat(track.danceability) || 0,
          energy: parseFloat(track.energy) || 0,
          key: parseInt(track.key, 10) || 0,
          loudness: parseFloat(track.loudness) || 0,
          mode: parseInt(track.mode, 10) || 0,
          speechiness: parseFloat(track.speechiness) || 0,
          acousticness: parseFloat(track.acousticness) || 0,
          instrumentalness: parseFloat(track.instrumentalness) || 0,
          liveness: parseFloat(track.liveness) || 0,
          valence: parseFloat(track.valence) || 0,
          tempo: parseFloat(track.tempo) || 0,
          time_signature: parseInt(track.time_signature, 10) || 0,
          track_genre: track.track_genre,
          artist_popularity: parseInt(track.artist_popularity, 10) || 0,
        } as ITrack;
      });
  }

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
