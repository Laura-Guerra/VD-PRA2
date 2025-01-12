import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { ITrack } from '../interfaces/track.interface';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit {
  data: ITrack[] = [];
  headers: (keyof ITrack)[] = []; // Especifica las claves válidas de ITrack
  currentData: ITrack[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 100;
  totalPages: number = 0;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getTracks().subscribe(tracks => {
      this.data = tracks;
      if (this.data.length > 0) {
        this.headers = Object.keys(this.data[0]) as (keyof ITrack)[];
      }
      this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);
      this.loadPage();
    });
  }

  loadPage(): void {
    const start = this.currentPage * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.currentData = this.data.slice(start, end);
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

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getDisplayValue(value: any): string {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value !== null && value !== undefined ? value.toString() : '';
  }
  
}
