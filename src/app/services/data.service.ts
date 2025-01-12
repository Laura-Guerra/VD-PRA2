import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ITrack } from '../interfaces/track.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tracksUrl = 'assets/data/tracks.csv';

  constructor(private http: HttpClient) {}

  // Carregar tracks des del fitxer CSV
  getTracks(): Observable<ITrack[]> {
    return this.http.get(this.tracksUrl, { responseType: 'text' }).pipe(
      map(csv => this.parseTracks(csv))
    );
  }

  // Parser per als dades dels tracks
  private parseTracks(csv: string): ITrack[] {
    const rows = csv.split('\n');
    const headers = rows.shift()?.split(',').map(header => header.trim()) || [];

    return rows
      .filter(row => row.trim().length > 0) // Ignorar files buides
      .map(row => {
        const values = this.splitCSVRow(row);
        const track: any = {};
        headers.forEach((header, index) => {
          track[header] = values[index];
        });

        // Mapeig dels camps del dataset a la interfície ITrack
        return {
          track_id: track.track_id,
          track_name: track.track_name,
          artist_name: track.artists ? track.artists.split(';').map((name: string) => name.trim()) : [],
          album_name: track.album_name,
          popularity: parseInt(track.popularity, 10) || 0,
          duration_ms: parseInt(track.duration_ms, 10) || 0,
          explicit: track.explicit === 'True', // Convertir a booleà
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
          track_genre: track.track_genre
        } as ITrack;
      });
  }

  // Utilitat per dividir files CSV amb cometes
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
