import { Component, inject } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { Router, RouterModule } from '@angular/router';
import { errorTailorImports } from '@ngneat/error-tailor';
import { TypedFormControls } from 'src/app/shared/models/typed-form-controls';
import { LoginUser } from 'src/app/auth/models/login-user';
import { UserService } from '../../../core/services/user.service';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormValidator } from '../../helpers/form-validator';
import { AlertService } from 'src/app/core/services/alert.service';
import { HttpErrorResponse } from '@angular/common/http';

type LoginTypedForm = TypedFormControls<LoginUser>;

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    DividerModule,
    errorTailorImports,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private readonly userService = inject(UserService);

  private readonly alertService = inject(AlertService);

  private readonly router = inject(Router);

  loginForm = new FormGroup<LoginTypedForm>({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(FormValidator.emailPattern),
      ],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  loginUser(): void {
    this.userService.loginUser(this.loginForm.value as LoginUser).subscribe({
      next: () => {
        this.alertService.displayMessage({
          severity: 'success',
          summary: 'Sesión iniciada exitosamente',
        });
        this.router.navigateByUrl('/storage');
      },
      error: (error: unknown) => {
        const status = error instanceof HttpErrorResponse ? error.status : 0;

        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error al iniciar sesión',
          detail:
            status === 400
              ? 'Usuario o contraseña incorrectos. Intente nuevamente.'
              : 'Error de conexión. Intente nuevamente más tarde.',
        });
      },
    });
  }
}
