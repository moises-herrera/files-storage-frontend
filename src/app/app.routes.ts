import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((routes) => routes.authRoutes),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
