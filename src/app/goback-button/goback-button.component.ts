import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-goback-button',
  templateUrl: './goback-button.component.html',
  styleUrls: ['./goback-button.component.scss']
})
export class GobackButtonComponent implements OnInit {

  constructor(public navigation: NavigationService) {
    this.navigation.startSaveHistory();
  }

  ngOnInit(): void {
  }

}
