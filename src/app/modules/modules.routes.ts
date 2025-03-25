import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const modulesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.routes').then((routes) => routes.homeRoutes),
      },
      {
        path: 'storage',
        loadChildren: () =>
          import('./storage/storage.routes').then(
            (routes) => routes.storageRoutes
          ),
      },
    ],
  },
];
