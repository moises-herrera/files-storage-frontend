import { Routes } from '@angular/router';
import { AuthComponent } from 'src/app/features/auth/auth.component';
import { LoginComponent } from 'src/app/features/auth/pages/login/login.component';
import { RegisterComponent } from 'src/app/features/auth/pages/register/register.component';

export const authRoutes: Routes = [
  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
      },
    ],
  },
];
