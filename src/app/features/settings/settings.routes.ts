import { Routes } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { environment } from 'src/environments/environment';

export const settingsRoutes: Routes = [
  {
    path: '',
    title: `${environment.appName} - Configuración`,
    component: SettingsComponent,
  },
];
