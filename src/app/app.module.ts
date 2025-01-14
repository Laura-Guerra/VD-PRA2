import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { CardsLayoutComponent } from './cards-layout/cards-layout.component';
import { CardsDetailComponent } from './cards-detail/cards-detail.component';
import { ContactComponent } from './contact/contact.component';
import { ErrorComponent } from './error/error.component';
import { GobackButtonComponent } from './goback-button/goback-button.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import ngx-translate and the http loader
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { DataTableComponent } from './data-table/data-table.component';
import { FormsModule } from '@angular/forms';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { ViolinChartComponent } from './violin-chart/violin-chart.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { AiUsageComponent } from './ai-usage/ai-usage.component';
import { FontsComponent } from './fonts/fonts.component';
import { HeatmapComponent } from './heatmap/heatmap.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    FooterComponent,
    CardsLayoutComponent,
    ErrorComponent,
    HomeComponent,
    ContactComponent,
    CardsDetailComponent,
    GobackButtonComponent,
    DataTableComponent,
    BubbleChartComponent,
    ViolinChartComponent,
    FilterMenuComponent,
    BarChartComponent,
    AiUsageComponent,
    FontsComponent,
    HeatmapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    // ngx-translate and the loader module
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),
    // Angular Material
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    FormsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}