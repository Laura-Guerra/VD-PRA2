import { DataTableComponent } from './data-table/data-table.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardsDetailComponent } from './cards-detail/cards-detail.component';
import { CardsLayoutComponent } from './cards-layout/cards-layout.component';
import { ContactComponent } from './contact/contact.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { BubbleChartComponent } from './bubble-chart/bubble-chart.component';
import { StackedBarChartComponent } from './stacked-bar-chart/stacked-bar-chart.component';
import { ViolinChartComponent } from './violin-chart/violin-chart.component';
import { FilterMenuComponent } from './filter-menu/filter-menu.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'cardgrid', component: CardsLayoutComponent},
  {path: 'carddetail', component: CardsDetailComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'data', component: DataTableComponent},
  {path: 'bubble-chart', component: BubbleChartComponent},
  {path: 'stacked', component: StackedBarChartComponent},
  {path: 'violin', component: ViolinChartComponent},
  {path: 'filter', component: FilterMenuComponent},
  {path: '**', component: ErrorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
