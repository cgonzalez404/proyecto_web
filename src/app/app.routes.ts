import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PortafolioComponent } from './portafolio/portafolio.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'portfolio',
    component: PortafolioComponent
  }
];
