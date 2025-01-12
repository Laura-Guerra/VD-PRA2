import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(private translate: TranslateService) {
/*     translate.addLangs(['en', 'es']);
    translate.setDefaultLang('en');
    translate.use('en'); */
  }

  ngOnInit(): void {
  }

  useLanguage(language: string): void {
    this.translate.use(language);
}

}
