import { Routes } from '@angular/router';
import { PortafolioComponent } from './portafolio/portafolio.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'portfolio',
    pathMatch: 'full'
  },
  {
    path: 'portfolio',
    component: PortafolioComponent
  }
];
