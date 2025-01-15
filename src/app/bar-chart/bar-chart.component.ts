import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { DataService } from '../services/data.service';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit {
  @ViewChild('chart', { static: true }) chartContainer!: ElementRef;
  data: ITrack[] = [];
  filteredData: ITrack[] = []; // Dades filtrades
  filtersEnabled: boolean = true; // Estat del checkbox

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTracks().subscribe((tracks) => {
      this.data = tracks;
      this.applyFilters(); // Filtrar les dades inicialment
    });
  }

  applyFilters(): void {
    this.filteredData = this.filtersEnabled
      ? this.data.filter((track) => track.popularity >= 50) // Ex: Filtrar popularitat > 50
      : [...this.data]; // Sense filtres

    this.createChart();
  }

  createChart(): void {
    const element = this.chartContainer.nativeElement;
    const margin = { top: 20, right: 20, bottom: 70, left: 50 };
    const width = 625 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Preprocessar les dades per comptar les cançons per gènere
    const genreCounts = this.filteredData.reduce((acc, track) => {
      acc[track.track_genre] = (acc[track.track_genre] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const genres = Object.keys(genreCounts);
    const counts = Object.values(genreCounts);

    d3.select(element).select('svg').remove();

    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const xScale = d3.scaleBand().domain(genres).range([0, width]).padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(counts) || 0])
      .range([height, 0]);

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(() => ''));

    svg.append('g').call(d3.axisLeft(yScale));

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('x', width / 2)
      .attr('y', height + margin.bottom - 10)
      .text('Gèneres Musicals');

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', `rotate(-90)`)
      .attr('x', -height / 2)
      .attr('y', -margin.left + 15)
      .text('Nombre de Cançons');

    const tooltip = d3
      .select(element)
      .append('div')
      .style('position', 'absolute')
      .style('background', '#fff')
      .style('border', '1px solid #ccc')
      .style('padding', '5px 10px')
      .style('border-radius', '5px')
      .style('box-shadow', '0 4px 6px rgba(0, 0, 0, 0.1)')
      .style('pointer-events', 'none')
      .style('visibility', 'hidden');

    svg
      .selectAll('.bar')
      .data(genres)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d)!)
      .attr('y', (d) => yScale(genreCounts[d]))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => height - yScale(genreCounts[d]))
      .attr('fill', '#69b3a2')
      .on('mouseover', (event, d) => {
        tooltip
          .style('visibility', 'visible')
          .text(`${d}: ${genreCounts[d]} cançons`);
      })
      .on('mousemove', (event) => {
        tooltip
          .style('top', `${event.pageY - 40}px`)
          .style('left', `${event.pageX + 10}px`);
      })
      .on('mouseout', () => {
        tooltip.style('visibility', 'hidden');
      });
  }

  toggleFilters(): void {
    this.filtersEnabled = !this.filtersEnabled;
    this.applyFilters();
  }
}
