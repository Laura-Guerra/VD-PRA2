import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  data: ITrack[] = []; // Totes les dades carregades
  filteredData: ITrack[] = []; // Dades filtrades
  currentData: ITrack[] = []; // Dades visibles a la pàgina actual
  headers: (keyof ITrack)[] = []; // Caps de taula (claus d'ITrack)
  currentPage: number = 0; // Pàgina actual
  itemsPerPage: number = 10; // Número d'elements per pàgina
  totalPages: number = 0; // Total de pàgines

  // Filtres
  filters = {
    track_name: '',
    artist_name: '',
    language: '',
    popularity: 0
  };

  availableLanguages: string[] = []; // Llista d'idiomes disponibles

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTracks().subscribe(tracks => {
      this.data = tracks;
      this.filteredData = [...this.data]; // Inicialment, totes les dades es mostren
      this.headers = Object.keys(this.data[0] || {}) as (keyof ITrack)[];
      this.availableLanguages = Array.from(new Set(this.data.map(track => track.language))).sort();
      this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
      this.loadPage();
    });
  }

  loadPage(): void {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentData = this.filteredData.slice(start, end);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPage();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPage();
    }
  }

  getDisplayValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value !== null && value !== undefined ? value.toString() : '';
  }

  applyFilters(): void {
    this.filteredData = this.data.filter(track => {
      const matchesTrackName = track.track_name.toLowerCase().includes(this.filters.track_name.toLowerCase());
      const matchesArtistName = track.artist_name.some(artist =>
        artist.toLowerCase().includes(this.filters.artist_name.toLowerCase())
      );
      const matchesLanguage = this.filters.language ? track.language === this.filters.language : true;
      const matchesPopularity = track.popularity >= this.filters.popularity;

      return matchesTrackName && matchesArtistName && matchesLanguage && matchesPopularity;
    });

    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.currentPage = 0;
    this.loadPage();
  }

  clearFilters(): void {
    this.filters = {
      track_name: '',
      artist_name: '',
      language: '',
      popularity: 0
    };
    this.filteredData = [...this.data];
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.currentPage = 0;
    this.loadPage();
  }
}
