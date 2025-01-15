import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ITrack } from '../interfaces/track.interface';
import * as d3 from 'd3';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {
  data: ITrack[] = []; // Totes les dades carregades
  filteredData: ITrack[] = []; // Dades filtrades
  currentData: ITrack[] = []; // Dades visibles a la pàgina actual
  headers: (keyof ITrack)[] = []; // Caps de taula (claus d'ITrack)
  currentPage: number = 0; // Pàgina actual
  itemsPerPage: number = 100; // Número d'elements per pàgina
  totalPages: number = 0; // Total de pàgines

  hoveredTrack: string | null = null; // ID del track que està sent mostrat en el radar chart

  // Filtres
  filters = {
    track_name: '',
    artist_name: '',
    track_genre: '',
    popularity: 0,
  };

  availableTrackGenre: string[] = []; // Llista d'idiomes disponibles

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTracks().subscribe((tracks) => {
      this.data = tracks;
      this.filteredData = [...this.data]; // Inicialment, totes les dades es mostren
      this.headers = Object.keys(this.data[0] || {}) as (keyof ITrack)[];
      this.availableTrackGenre = Array.from(
        new Set(this.data.map((track) => track.track_genre))
      ).sort();
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
    this.filteredData = this.data.filter((track) => {
      const matchesTrackName = track.track_name
        .toLowerCase()
        .includes(this.filters.track_name.toLowerCase());
      const matchesArtistName = track.artist_name.some((artist) =>
        artist.toLowerCase().includes(this.filters.artist_name.toLowerCase())
      );
      const matchesGenre = this.filters.track_genre
        ? track.track_genre === this.filters.track_genre
        : true;
      const matchesPopularity = track.popularity >= this.filters.popularity;

      return (
        matchesTrackName &&
        matchesArtistName &&
        matchesGenre &&
        matchesPopularity
      );
    });

    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.currentPage = 0;
    this.loadPage();
  }

  clearFilters(): void {
    this.filters = {
      track_name: '',
      artist_name: '',
      track_genre: '',
      popularity: 0,
    };
    this.filteredData = [...this.data];
    this.totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
    this.currentPage = 0;
    this.loadPage();
  }

  showRadarChart(track: ITrack): void {
    this.hoveredTrack = track.track_id; // Estableix l'ID del track actiu
    setTimeout(() => {
      const container = d3.select(`#radar-chart-${track.track_id}`);
      if (!container.empty()) {
        this.drawRadarChart(track); // Només dibuixa si el contenidor existeix
      }
    }, 0); // Retard curt per assegurar que el DOM està llest
  }

  hideRadarChart(): void {
    this.hoveredTrack = null; // Amaga el radar chart
    d3.select('#radar-chart').selectAll('*').remove(); // Elimina el contingut del gràfic
  }

  // Dibuixa el radar chart
  private drawRadarChart(track: ITrack): void {
    const container = d3.select(`#radar-chart-${track.track_id}`);
    if (!container.node()) {
      console.error(
        `El contenidor #radar-chart-${track.track_id} no existeix.`
      );
      return; // Atura si el contenidor no està disponible
    }
    container.selectAll('*').remove();

    const data = [
      { axis: 'Energia', value: track.energy },
      { axis: 'Dansabilitat', value: track.danceability },
      { axis: 'València', value: track.valence },
      { axis: 'Acústica', value: track.acousticness },
      { axis: 'Parla', value: track.speechiness },
    ];

    const margin = 50; // MARGE EXTRA
    const width = 300; // Amplada total del contenidor
    const height = 300; // Alçada total del contenidor
    const radius = Math.min(width, height) / 2 - margin; // Ajustem el radi per al marge

    const svg = container
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const rScale = d3.scaleLinear().range([0, radius]).domain([0, 1]);

    svg
      .selectAll('.levels')
      .data(d3.range(1, 6).reverse())
      .enter()
      .append('circle')
      .attr('class', 'gridCircle')
      .attr('r', (d) => (radius / 5) * d)
      .style('fill', '#CDCDCD')
      .style('stroke', '#CDCDCD')
      .style('fill-opacity', 0.1);

    const angleSlice = (Math.PI * 2) / data.length;

    const radarLine = d3
      .lineRadial<{ axis: string; value: number }>()
      .radius((d) => rScale(d.value))
      .angle((d, i) => i * angleSlice);

    svg
      .append('path')
      .datum(data)
      .attr('class', 'radarArea')
      .attr('d', radarLine as any)
      .style('fill', 'blue')
      .style('fill-opacity', 0.7);

    // Afegir eixos
    const axisGrid = svg.append('g').attr('class', 'axisWrapper');

    axisGrid
      .selectAll('.axis')
      .data(data)
      .enter()
      .append('line')
      .attr('class', 'axisLine')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', (d, i) => rScale(1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y2', (d, i) => rScale(1) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('stroke', 'black')
      .style('stroke-width', '2px');

    // Afegir etiquetes als eixos
    axisGrid
      .selectAll('.axisLabel')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'axisLabel')
      .attr('x', (d, i) => rScale(1.1) * Math.cos(angleSlice * i - Math.PI / 2))
      .attr('y', (d, i) => rScale(1.1) * Math.sin(angleSlice * i - Math.PI / 2))
      .style('font-size', '12px')
      .style('text-anchor', 'middle')
      .text((d) => d.axis);
  }
}
