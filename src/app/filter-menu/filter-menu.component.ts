import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-filter-menu',
  templateUrl: './filter-menu.component.html',
  styleUrls: ['./filter-menu.component.scss'],
})
export class FilterMenuComponent implements OnInit {
  genres: { name: string; popularity: number }[] = [];
  filteredGenres: { name: string; popularity: number }[] = [];
  genreSearch: string = '';
  popularity: number = 75;
  sortOption: 'popularity' | 'alphabetical' = 'popularity';

  @Input() selectedGenres: string[] = [];
  @Output() filtersChanged = new EventEmitter<{
    genres: string[];
    popularity: number;
  }>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTracks().subscribe((tracks) => {
      const genreCounts = tracks.reduce((acc, track) => {
        acc[track.track_genre] = acc[track.track_genre] || {
          count: 0,
          totalPopularity: 0,
        };
        acc[track.track_genre].count += 1;
        acc[track.track_genre].totalPopularity += track.popularity;
        return acc;
      }, {} as Record<string, { count: number; totalPopularity: number }>);

      this.genres = Object.entries(genreCounts)
        .map(([genre, data]) => ({
          name: genre,
          popularity: data.totalPopularity / data.count,
        }))
        .sort((a, b) => b.popularity - a.popularity);

      if (this.selectedGenres.length === 0) {
        this.selectedGenres = this.genres
          .slice(0, 5)
          .map((genre) => genre.name);
      }

      this.filterGenres();
      this.emitFilters();
    });
  }

  updateDefaultSelection(): void {
    if (this.selectedGenres.length === 0) {
      this.selectedGenres = this.genres.slice(0, 5).map((genre) => genre.name);
    }
    this.emitFilters();
  }

  filterGenres(): void {
    const lowerSearch = this.genreSearch.toLowerCase();

    // Filtrar géneros que coincidan con la búsqueda
    const unselectedGenres = this.genres.filter(
      (genre) =>
        !this.selectedGenres.includes(genre.name) &&
        genre.name.toLowerCase().includes(lowerSearch)
    );

    // Ordenar géneros no seleccionados según la opción de orden actual
    if (this.sortOption === 'popularity') {
      unselectedGenres.sort((a, b) => b.popularity - a.popularity);
    } else if (this.sortOption === 'alphabetical') {
      unselectedGenres.sort((a, b) => a.name.localeCompare(b.name));
    }

    // Combinar géneros seleccionados con los no seleccionados, manteniendo seleccionados arriba
    this.filteredGenres = [
      ...this.selectedGenres
        .map((name) => this.genres.find((genre) => genre.name === name)!)
        .filter((genre) => genre.name.toLowerCase().includes(lowerSearch)), // Aplicar búsqueda también a seleccionados
      ...unselectedGenres,
    ];
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

    this.filterGenres(); // Reordenar la lista después de cambiar la selección
    this.emitFilters(); // Emitir los filtros actualizados
  }

  emitFilters(): void {
    this.filtersChanged.emit({
      genres: this.selectedGenres,
      popularity: this.popularity,
    });
  }

  applySort(): void {
    if (this.sortOption === 'popularity') {
      this.filteredGenres.sort((a, b) => b.popularity - a.popularity);
    } else if (this.sortOption === 'alphabetical') {
      this.filteredGenres.sort((a, b) => a.name.localeCompare(b.name));
    }
  }

  onSortChange(option: 'popularity' | 'alphabetical'): void {
    this.sortOption = option;
    this.applySort();
  }
}
