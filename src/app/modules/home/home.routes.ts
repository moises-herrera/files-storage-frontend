import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { environment } from 'src/environments/environment';

export const homeRoutes: Routes = [
  {
    path: '',
    title: `${environment.appName} - Home`,
    component: HomeComponent,
  },
];
