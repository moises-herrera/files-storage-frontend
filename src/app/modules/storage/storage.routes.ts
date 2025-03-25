import { Routes } from '@angular/router';
import { StorageComponent } from './storage.component';
import { environment } from 'src/environments/environment';

export const storageRoutes: Routes = [
  {
    path: '',
    title: `${environment.appName} - Almacenamiento`,
    component: StorageComponent,
  },
];
