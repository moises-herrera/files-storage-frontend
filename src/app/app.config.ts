import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';

import { routes } from './app.routes';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { provideErrorTailorConfig } from '@ngneat/error-tailor';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { AppTheme } from './themes/app-theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: AppTheme,
        options: {
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng',
          },
          darkModeSelector: '.app-dark',
        },
      },
    }),
    provideErrorTailorConfig({
      errors: {
        useValue: {
          required: 'Este campo es requerido',
          minlength: ({ requiredLength }) =>
            `El campo debe tener mínimo ${requiredLength} carácteres`,
          min: ({ min }) => `El valor debe ser mayor a ${min}`,
          pattern: 'El valor ingresado es inválido',
          passwordsMatch: 'Las contraseñas no coinciden',
        },
      },
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes),
    MessageService,
    ConfirmationService,
  ],
};
