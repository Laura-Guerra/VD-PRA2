import { DataTableComponent } from './data-table/data-table.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CardsDetailComponent } from './cards-detail/cards-detail.component';
import { CardsLayoutComponent } from './cards-layout/cards-layout.component';
import { ContactComponent } from './contact/contact.component';
import { ErrorComponent } from './error/error.component';
import { HomeComponent } from './home/home.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { FontsComponent } from './fonts/fonts.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'cardgrid', component: CardsLayoutComponent },
  { path: 'carddetail', component: CardsDetailComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'data', component: DataTableComponent },
  { path: 'fonts', component: FontsComponent },
  { path: '**', component: ErrorComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
