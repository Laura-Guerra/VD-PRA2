import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'bubble-chart',
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.scss']
})
export class BubbleChartComponent implements OnChanges {
  @Input() genres: string[] = [];
  @Input() popularity: number = 50;
  @Input() data: ITrack[] = []; // Ara rebrà les dades del component superior

  filteredData: ITrack[] = [];

  // Parelles de característiques a comparar
  characteristicPairs: { x: keyof ITrack; y: keyof ITrack }[] = [
    { x: 'danceability', y: 'energy' },
    { x: 'danceability', y: 'valence' },
    { x: 'energy', y: 'valence' },
    { x: 'acousticness', y: 'speechiness' },
    { x: 'liveness', y: 'valence' }
  ];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
  if (changes['genres'] || changes['popularity'] || changes['data']) {
    this.applyFilters();
  }
  }

  applyFilters(): void {
    if (!this.data || this.data.length === 0) {
      this.filteredData = [];
      return;
    }

    // Filtra les dades segons els inputs
    this.filteredData = this.data.filter(
      (track) =>
        this.genres.includes(track.track_genre) &&
        track.popularity >= this.popularity
    );

    this.createCharts();
    this.createLegend()
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

    const radiusScale = d3
      .scaleSqrt()
      .domain([0, 100]) // Popularitat entre 0 i 100
      .range([2, 10]); // Radi de les bombolles

    // Afegir el tooltip
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
      .style('opacity', 0);

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

    svg
      .selectAll('.bubble')
      .data(this.filteredData)
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('cx', (d) => xScale(d[pair.x] as number))
      .attr('cy', (d) => yScale(d[pair.y] as number))
      .attr('r', (d) => radiusScale(d.popularity))
      .style('fill', (d) => colorScale(d.track_genre))
      .style('opacity', 0.5)
      .on('mouseover', (event, d) => {
        tooltip
          .html(
            `<strong>Cançó:</strong> ${d.track_name}<br><strong>Popularitat:</strong> ${d.popularity}`
          )
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 30}px`)
          .style('opacity', 1);
      })
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      });
}



  createLegend(): void {
    const container = d3.select('.legend');
    container.selectAll('*').remove();
  
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10); // Escala de colors
    const displayedGenres = Array.from(new Set(this.filteredData.map((d) => d.track_genre))); // Gèneres únics de les dades filtrades
  
    const legend = container
      .append('svg')
      .attr('width', 300)
      .attr('height', displayedGenres.length * 30)
      .selectAll('.legend-item')
      .data(displayedGenres)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 25})`);
  
    legend
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 18)
      .attr('height', 18)
      .attr('fill', (d) => colorScale(d));
  
    legend
      .append('text')
      .attr('x', 25)
      .attr('y', 14)
      .attr('font-size', '12px')
      .text((d) => d);
  }
}
