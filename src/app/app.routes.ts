import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.routes').then((routes) => routes.authRoutes),
  },
  {
    path: '',
    canActivate: [authGuard],
    canMatch: [authGuard],
    loadChildren: () =>
      import('./modules/modules.routes').then((routes) => routes.modulesRoutes),
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
