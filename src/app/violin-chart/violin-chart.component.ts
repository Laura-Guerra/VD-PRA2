import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import * as d3 from 'd3';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'violin-chart',
  templateUrl: './violin-chart.component.html',
  styleUrls: ['./violin-chart.component.scss'],
})
export class ViolinChartComponent implements OnChanges {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  @Input() genres: string[] = []; // Gèneres seleccionats
  @Input() popularity: number = 50; // Popularitat mínima
  @Input() data: ITrack[] = []; // Dades passades pel component Home

  filteredData: ITrack[] = [];

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

    this.filteredData = this.data.filter((track) =>
      this.genres.includes(track.track_genre)
    );

    this.createChart();
  }

  createChart(): void {
    const element = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 30, bottom: 50, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(element).select('svg').remove();

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3
      .scaleBand()
      .domain(this.genres)
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Eix X
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('text-anchor', 'end');

    // Eix Y
    const yAxis = svg.append('g').call(d3.axisLeft(yScale));

    // Títol de l'eix Y
    yAxis
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .attr('fill', 'black')
      .style('font-size', '14px')
      .text('Popularitat');

    // Crear violins
    this.genres.forEach((genre) => {
      const genreData = this.filteredData
        .filter((d) => d.track_genre === genre)
        .map((d) => d.popularity);

      if (genreData.length === 0) {
        return;
      }

      const kde = this.kernelDensityEstimator(
        this.kernelEpanechnikov(7),
        yScale.ticks(40)
      );

      const density = kde(genreData);

      svg
        .append('path')
        .datum(density)
        .attr('fill', colorScale(genre))
        .attr('opacity', 0.7)
        .attr('stroke', '#000')
        .attr(
          'd',
          d3
            .area()
            .x0(
              (d) =>
                xScale(genre)! +
                xScale.bandwidth() / 2 -
                Math.min(d[1] * 300, 100)
            )
            .x1(
              (d) =>
                xScale(genre)! +
                xScale.bandwidth() / 2 +
                Math.min(d[1] * 300, 100)
            )
            .y((d) => yScale(d[0]))
        );
    });
  }

  kernelDensityEstimator(kernel: any, X: number[]): any {
    return (V: number[]) =>
      X.map((x) => [x, d3.mean(V, (v) => kernel(x - v)) || 0]);
  }

  kernelEpanechnikov(bandwidth: number): any {
    return (u: number) =>
      Math.abs(u / bandwidth) <= 1
        ? (0.75 * (1 - (u / bandwidth) ** 2)) / bandwidth
        : 0;
  }
}
