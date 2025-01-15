import { Component } from '@angular/core';
import { DataService } from '../services/data.service';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  showFilters: boolean = false;
  selectedGenres: string[] = [];
  popularity: number = 50;
  data: ITrack[] = []; // Afegit per passar les dades

  constructor(private dataService: DataService) {
    this.dataService.getTracks().subscribe((tracks) => {
      this.data = tracks;
    });
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters; // Només canvia la visibilitat
  }

  updateFilters(event: { genres: string[]; popularity: number }): void {
    this.selectedGenres = event.genres;
    this.popularity = event.popularity;
    this.data = [...this.data];
  }
}
