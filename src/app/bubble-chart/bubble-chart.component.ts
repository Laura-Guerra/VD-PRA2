import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import * as d3 from 'd3';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'app-bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnInit {
  data: ITrack[] = [];
  filteredData: ITrack[] = [];
  genres: string[] = [];
  selectedGenres: string[] = [];
  genreSearch: string = '';
  filteredGenres: string[] = [];
  filters = {
    popularity: 50 // Popularitat mínima
  };
  showFilters: boolean = false;

  // Parelles de característiques a comparar
  characteristicPairs: { x: keyof ITrack; y: keyof ITrack }[] = [
    { x: 'danceability', y: 'energy' },
    { x: 'danceability', y: 'valence' },
    { x: 'energy', y: 'valence' },
    { x: 'acousticness', y: 'speechiness' },
    { x: 'liveness', y: 'valence' }
  ];
  

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTracks().subscribe((tracks) => {
      this.data = tracks;

      // Agrupar i ordenar els gèneres alfabèticament
      this.genres = Array.from(new Set(this.data.map((d) => d.track_genre))).sort();

      // Inicialment, mostra tots els gèneres
      this.filteredGenres = [...this.genres];

      // Selecciona automàticament els primers 5 gèneres
      this.selectedGenres = this.genres.slice(0, 5);

      this.applyFilters();
    });
  }

  filterGenres(): void {
    this.filteredGenres = this.genres.filter((genre) =>
      genre.toLowerCase().includes(this.genreSearch.toLowerCase())
    );
  }

  applyFilters(): void {
    if (this.selectedGenres.length === 0) {
      this.filteredData = [...this.data];
    } else {
      this.filteredData = this.data.filter((track) =>
        this.selectedGenres.includes(track.track_genre)
      );
    }

    // Filtrar per popularitat
    this.filteredData = this.filteredData.filter(
      (track) => track.popularity >= this.filters.popularity
    );

    this.createCharts();
  }

  createCharts(): void {
    const chartElements = document.querySelectorAll('.chart-container .chart');
    chartElements.forEach((element, index) => {
      const pair = this.characteristicPairs[index];
      this.createChart(pair, element as HTMLElement);
    });
  }

  createChart(pair: { x: keyof ITrack; y: keyof ITrack }, element: HTMLElement): void {
    d3.select(element).select('svg').remove();
  
    const width = 300;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height);
  
    const xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([margin.left, width - margin.right]);
  
    const yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([height - margin.bottom, margin.top]);
  
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Eixos
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(5))
      .append('text')
      .attr('x', width - margin.right)
      .attr('y', -10)
      .attr('fill', 'black')
      .style('text-anchor', 'end')
      .text(pair.x as string);
  
    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).ticks(5))
      .append('text')
      .attr('x', 10)
      .attr('y', margin.top)
      .attr('fill', 'black')
      .style('text-anchor', 'start')
      .text(pair.y as string);
  
    // Dibuixar les bombolles
    svg
      .selectAll('.bubble')
      .data(this.filteredData)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', (d) => xScale(d[pair.x] as number))
      .attr('cy', (d) => yScale(d[pair.y] as number))
      .attr('r', 5)
      .style('fill', (d) => colorScale(d.track_genre))
      .style('opacity', 0.8);
  }
  

  toggleGenre(genre: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.checked) {
      this.selectedGenres.push(genre);
    } else {
      this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
    }
    this.applyFilters();
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
}
