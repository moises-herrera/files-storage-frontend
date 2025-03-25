import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AbstractControlOptions,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { RegisterForm } from 'src/app/auth/models/register-form';
import { FormValidator } from 'src/app/auth/helpers/form-validator';
import { TypedFormControls } from 'src/app/shared/models/typed-form-controls';
import { UserService } from 'src/app/auth/services/user.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { errorTailorImports } from '@ngneat/error-tailor';

type RegisterTypedForm = TypedFormControls<RegisterForm>;

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    errorTailorImports,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly userService = inject(UserService);

  private readonly router = inject(Router);

  private readonly alertService = inject(AlertService);

  strongPasswordRegex = FormValidator.strongPasswordPattern;

  mediumPasswordRegex = FormValidator.mediumPasswordPattern;

  registerForm = new FormGroup<RegisterTypedForm>(
    {
      firstName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      lastName: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)],
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.pattern(FormValidator.emailPattern),
        ],
      }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(FormValidator.mediumPasswordPattern),
        ],
      }),
      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)],
      }),
    },
    {
      updateOn: 'blur',
      validators: FormValidator.validatePasswordsMatch(
        'password',
        'confirmPassword'
      ),
    } as AbstractControlOptions
  );

  isLoading = false;

  registerUser(): void {
    this.isLoading = true;
    const { confirmPassword, ...data } = this.registerForm.value;
    this.userService.registerUser(data as RegisterForm).subscribe({
      next: () => {
        this.isLoading = false;
        this.alertService.displayMessage({
          severity: 'success',
          summary: 'Registro exitoso',
        });
        this.router.navigateByUrl('/storage');
      },
      error: () => {
        this.isLoading = false;
        this.alertService.displayMessage({
          severity: 'error',
          summary: 'Error al crear la cuenta',
        });
      },
    });
  }

  get password(): AbstractControl | null {
    return this.registerForm.get('password');
  }

  get isPasswordInvalid(): boolean {
    return (
      this.password !== null && this.password.touched && this.password.invalid
    );
  }

  get passwordErrorMessage(): string {
    return this.password?.hasError('required')
      ? 'El campo es requerido'
      : this.password?.hasError('minlength')
      ? 'El campo debe tener mínimo 8 carácteres'
      : this.password?.hasError('pattern')
      ? 'La contraseña debe contener al menos letras mayúsculas, minúsculas y números'
      : '';
  }
}
