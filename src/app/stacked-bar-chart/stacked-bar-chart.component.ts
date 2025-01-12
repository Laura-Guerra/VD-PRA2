import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../services/data.service';
import * as d3 from 'd3';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'app-stacked-bar-chart',
  templateUrl: './stacked-bar-chart.component.html',
  styleUrls: ['./stacked-bar-chart.component.scss']
})
export class StackedBarChartComponent implements OnInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;

  data: ITrack[] = [];
  filteredData: ITrack[] = [];
  genres: string[] = [];
  colorScale = d3.scaleOrdinal(d3.schemeCategory10);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTracks().subscribe((tracks) => {
      this.data = tracks;

      // Agrupem els gèneres únics
      this.genres = Array.from(new Set(this.data.map((d) => d.track_genre)));

      this.createChart();
    });
  }

  createChart(): void {
    const element = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    d3.select(element).select('svg').remove(); // Elimina gràfics existents

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Agrupem les dades per gènere i popularitat
    const genreData = this.genres.map((genre) => {
      const genreTracks = this.data.filter((d) => d.track_genre === genre);
      const popularityBuckets = d3.range(0, 101, 20).map((bucket) => ({
        bucket: `${bucket}-${bucket + 19}`,
        count: genreTracks.filter(
          (track) =>
            track.popularity >= bucket && track.popularity < bucket + 20
        ).length
      }));

      return { genre, buckets: popularityBuckets };
    });

    // Escales
    const xScale = d3
      .scaleBand()
      .domain(this.genres)
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(genreData, (d) =>
        d3.sum(d.buckets, (bucket) => bucket.count)
      ) as number])
      .range([height, 0]);

    const color = this.colorScale;

    // Eixos
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg
      .append('g')
      .call(d3.axisLeft(yScale));

    // Creem les barres apilades
    genreData.forEach((genre, index) => {
      let stackHeight = 0;

      genre.buckets.forEach((bucket) => {
        svg
          .append('rect')
          .attr('x', xScale(genre.genre) as number)
          .attr('y', yScale(stackHeight + bucket.count))
          .attr('width', xScale.bandwidth())
          .attr('height', yScale(stackHeight) - yScale(stackHeight + bucket.count))
          .attr('fill', color(bucket.bucket));

        stackHeight += bucket.count;
      });
    });

    // Tooltip
    const tooltip = d3
      .select(element)
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    svg
      .selectAll('rect')
      .on('mouseover', function (event, d:any) {
        tooltip
          .style('opacity', 1)
          .html(`Popularitat: ${d.bucket}<br>Cançons: ${d.count}`)
          .style('left', `${event.pageX + 5}px`)
          .style('top', `${event.pageY - 28}px`);
      })
      .on('mouseout', () => tooltip.style('opacity', 0));
  }
}
