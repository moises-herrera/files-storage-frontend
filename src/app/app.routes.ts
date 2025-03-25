import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((routes) => routes.authRoutes),
  },
  {
    path: 'storage',
    canActivate: [authGuard],
    canMatch: [authGuard],
    loadChildren: () =>
      import('./storage/storage.routes').then((routes) => routes.storageRoutes),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
