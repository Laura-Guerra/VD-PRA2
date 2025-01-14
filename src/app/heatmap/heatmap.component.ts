import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'heatmap-chart',
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss']
})
export class HeatmapComponent implements OnChanges {
  @Input() genres: string[] = [];
  @Input() popularity: number = 50;
  @Input() data: ITrack[] = []; // Dades passades pel component superior

  filteredData: Record<string, ITrack[]> = {}; // Gènere -> Dades filtrades

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Canvis rebuts a HeatmapChart:', changes);
    if (changes['genres'] || changes['popularity'] || changes['data']) {
      this.applyFilters();
    }
  }

  applyFilters(): void {
    if (!this.data || this.data.length === 0) {
      this.filteredData = {};
      return;
    }

    // Filtrar dades per popularitat i gèneres seleccionats
    this.filteredData = this.genres.reduce((acc, genre) => {
      acc[genre] = this.data.filter(
        (track) =>
          track.track_genre === genre &&
          track.popularity >= this.popularity &&
          track.artist_popularity !== undefined
      );
      return acc;
    }, {} as Record<string, ITrack[]>);

    console.log('Dades filtrades per gènere:', this.filteredData);

    this.createHeatmaps();
  }

  createHeatmaps(): void {
    Object.entries(this.filteredData).forEach(([genre, tracks]) => {
      const element = document.querySelector(`#heatmap-${genre}`) as HTMLElement;
      const margin = { top: 20, right: 30, bottom: 60, left: 70 };
      const width = 400 - margin.left - margin.right;
      const height = 300 - margin.top - margin.bottom;

      d3.select(element).select('svg').remove();

      const svg = d3
        .select(element)
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const xScale = d3
        .scaleLinear()
        .domain([0, 100]) // Popularitat de la cançó
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        .domain([0, 100]) // Popularitat de l'artista
        .range([height, 0]);

      const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 100]);

      // Dibuixar les cel·les del heatmap
      tracks.forEach((track) => {
        svg
          .append('rect')
          .attr('x', xScale(track.popularity))
          .attr('y', yScale(track.artist_popularity!))
          .attr('width', xScale(5) - xScale(0))
          .attr('height', yScale(0) - yScale(5))
          .attr('fill', colorScale(track.artist_popularity!))
          .attr('opacity', 0.8)
          .on('mouseover', (event) => {
            const tooltip = d3
              .select('body')
              .append('div')
              .attr('class', 'tooltip')
              .style('position', 'absolute')
              .style('background', '#fff')
              .style('border', '1px solid #ccc')
              .style('padding', '10px')
              .style('border-radius', '5px')
              .style('pointer-events', 'none')
              .style('opacity', 1)
              .html(
                `<strong>Cançó:</strong> ${track.track_name}<br>` +
                `<strong>Popularitat Cançó:</strong> ${track.popularity}<br>` +
                `<strong>Popularitat Artista:</strong> ${track.artist_popularity}`
              )
              .style('left', `${event.pageX + 10}px`)
              .style('top', `${event.pageY - 30}px`);
          })
          .on('mouseout', () => {
            d3.select('body').select('.tooltip').remove();
          });
      });

      // Afegir eixos
      svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

      svg.append('g').call(d3.axisLeft(yScale));

      // Afegir títols als eixos
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.bottom - 10)
        .attr('text-anchor', 'middle')
        .text('Popularitat de la Cançó');

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 20)
        .attr('text-anchor', 'middle')
        .text("Popularitat de l'Artista");
    });
  }
}
