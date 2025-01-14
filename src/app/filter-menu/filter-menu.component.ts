import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss']
})
export class FilterMenuComponent implements OnInit {
  genres: string[] = [];
  filteredGenres: string[] = [];
  genreSearch: string = '';
  popularity: number = 75;

  @Input() selectedGenres: string[] = [];
  @Output() filtersChanged = new EventEmitter<{ genres: string[]; popularity: number }>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTracks().subscribe((tracks) => {
      const genreCounts = tracks.reduce((acc, track) => {
        acc[track.track_genre] = (acc[track.track_genre] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
  
      this.genres = Object.entries(genreCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .map(([genre]) => genre);
  
      // Si no hi ha gèneres seleccionats, selecciona els 5 primers
      if (this.selectedGenres.length === 0) {
        this.selectedGenres = this.genres.slice(0, 5);
      }
  
      this.filteredGenres = [...this.genres];
      this.emitFilters(); // Emet els filtres actuals
    });
  }
  

  filterGenres(): void {
    this.filteredGenres = this.genres.filter((genre) =>
      genre.toLowerCase().includes(this.genreSearch.toLowerCase())
    );
  }

  toggleGenre(genre: string, event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.checked) {
      if (this.selectedGenres.length >= 5) {
        alert('Només pots seleccionar fins a 5 gèneres.');
        input.checked = false;
      } else {
        this.selectedGenres.push(genre);
      }
    } else {
      this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
    }

    this.emitFilters();
  }

  emitFilters(): void {
    this.filtersChanged.emit({
      genres: this.selectedGenres,
      popularity: this.popularity
    });
  }
}
